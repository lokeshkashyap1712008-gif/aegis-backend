import base64

def decode_base64(value):
    try:
        return base64.b64decode(value).decode()
    except:
        return value