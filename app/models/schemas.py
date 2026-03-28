from pydantic import BaseModel

class LogRequest(BaseModel):
    identifier: str
    code: int
    response_time: float