class d(dict):
    def __init__(self, *a, **k):
        super(d, self).__init__(*a, **k)
        self.__dict__ = self
        
class ErrorCode:
	SUCCESS = 0
	GENERAL_ERROR = 1

def success(data = None):
	return d({"status":True, "msg":"OK", "error":ErrorCode.SUCCESS, "data":data})
def fail(msg, error = ErrorCode.GENERAL_ERROR, data = None):
	return d({"status":False, "msg":msg, "error":error, "data":data})

