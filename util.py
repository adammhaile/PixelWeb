class d(dict):
    def __init__(self, *a, **k):
        super(d, self).__init__(*a, **k)
        self.__dict__ = self
        for k in self.__dict__:
            if isinstance(self.__dict__[k], dict):
                self.__dict__[k] = d(self.__dict__[k])
            elif isinstance(self.__dict__[k], list):
                for i in range(len(self.__dict__[k])):
                    if isinstance(self.__dict__[k][i], dict):
                        self.__dict__[k][i] = d(self.__dict__[k][i])
    def upgrade(self, a):
        for k,v in a.items():
            if not k in self:
                self[k] = v

class ErrorCode:
    SUCCESS = 0
    GENERAL_ERROR = 1
    BP_ERROR = 2

def success(data = None):
    return d({"status":True, "msg":"OK", "error":ErrorCode.SUCCESS, "data":data})
def fail(msg, error = ErrorCode.GENERAL_ERROR, data = None):
    return d({"status":False, "msg":msg, "error":error, "data":data})
