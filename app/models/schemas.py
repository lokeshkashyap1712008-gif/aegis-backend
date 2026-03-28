from pydantic import BaseModel
from typing import Optional

class LogRequest(BaseModel):
    identifier: Optional[str] = None
    code: Optional[int] = None
    response_time: Optional[float] = None