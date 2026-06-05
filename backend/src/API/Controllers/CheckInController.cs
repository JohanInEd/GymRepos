using GymSaaS.Application.Abstractions;
using GymSaaS.Application.DTOs.CheckIns;
using GymSaaS.Domain.Entities;
using GymSaaS.Domain.Enums;
using GymSaaS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymSaaS.API.Controllers;

[ApiController]
[Route("api/check-ins")]
[Authorize(Policy = "TenantStaff")]
public sealed class CheckInController : ControllerBase
{
    private readonly GymSaaSDbContext _dbContext;
    private readonly ITenantProvider _tenantProvider;

    public CheckInController(GymSaaSDbContext dbContext, ITenantProvider tenantProvider)
    {
        _dbContext = dbContext;
        _tenantProvider = tenantProvider;
    }

    [HttpPost]
    public async Task<ActionResult<CheckInResponse>> CheckIn(
        CheckInRequest request,
        CancellationToken cancellationToken)
    {
        if (request.MemberId == Guid.Empty)
        {
            return BadRequest("Member id is required.");
        }

        var member = await _dbContext.Members
            .AsNoTracking()
            .SingleOrDefaultAsync(
                member => member.Id == request.MemberId && member.IsActive,
                cancellationToken);

        if (member is null)
        {
            return NotFound("The selected member does not exist or is inactive.");
        }

        var latestSubscription = await _dbContext.Subscriptions
            .Include(subscription => subscription.Plan)
            .AsNoTracking()
            .Where(subscription => subscription.MemberId == request.MemberId)
            .OrderByDescending(subscription => subscription.EndDate)
            .ThenByDescending(subscription => subscription.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var accessGranted = latestSubscription?.IsCurrentlyActive(today) == true;
        var reason = GetDecisionReason(latestSubscription, today);
        var checkedInAt = DateTimeOffset.UtcNow;

        var attendance = new Attendance
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantProvider.CurrentTenantId,
            MemberId = member.Id,
            SubscriptionId = latestSubscription?.Id,
            CheckedInAt = checkedInAt,
            AccessGranted = accessGranted,
            Reason = reason,
            RecordedByUserId = request.RecordedByUserId?.Trim()
        };

        _dbContext.Attendances.Add(attendance);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new CheckInResponse(
            attendance.Id,
            member.Id,
            member.FullName,
            accessGranted,
            reason,
            checkedInAt,
            latestSubscription?.EndDate));
    }

    [HttpGet("recent")]
    public async Task<ActionResult<IReadOnlyList<AttendanceLogDto>>> GetRecent(
        [FromQuery] int take = 25,
        CancellationToken cancellationToken = default)
    {
        var safeTake = Math.Clamp(take, 1, 100);
        var logs = await _dbContext.Attendances
            .AsNoTracking()
            .OrderByDescending(attendance => attendance.CheckedInAt)
            .Take(safeTake)
            .Select(attendance => new AttendanceLogDto(
                attendance.Id,
                attendance.MemberId,
                attendance.Member == null
                    ? "Miembro eliminado"
                    : attendance.Member.FirstName + " " + attendance.Member.LastName,
                attendance.Subscription == null || attendance.Subscription.Plan == null
                    ? null
                    : attendance.Subscription.Plan.Name,
                attendance.AccessGranted,
                attendance.Reason,
                attendance.CheckedInAt))
            .ToListAsync(cancellationToken);

        return Ok(logs);
    }

    private static string GetDecisionReason(Subscription? subscription, DateOnly today)
    {
        if (subscription is null)
        {
            return "Sin plan registrado";
        }

        if (subscription.IsCurrentlyActive(today))
        {
            return "Plan activo";
        }

        if (subscription.EndDate < today)
        {
            return "Plan vencido";
        }

        return subscription.Status switch
        {
            SubscriptionStatus.PendingPayment => "Pago pendiente",
            SubscriptionStatus.Suspended => "Plan suspendido",
            SubscriptionStatus.Cancelled => "Plan cancelado",
            _ => "Plan no activo"
        };
    }
}
