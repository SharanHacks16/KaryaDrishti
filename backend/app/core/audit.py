import logging
from datetime import datetime
from typing import Optional, Dict, Any

logger = logging.getLogger("karyadrishti.audit")

def log_audit_event(
    user_id: str,
    action: str,
    resource: str,
    details: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None
):
    """
    Log security-relevant audit event for authentication, report generation, admin action, etc.
    """
    event = {
        "timestamp": datetime.utcnow().isoformat(),
        "user_id": user_id,
        "action": action,
        "resource": resource,
        "details": details or {},
        "ip_address": ip_address or "127.0.0.1"
    }
    logger.info(f"AUDIT_EVENT: {event}")
    return event
