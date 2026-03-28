from app.utils.decoder import decode_base64

# simple in-memory cache
cache = {}

def decode_node_id(raw_id):
    if raw_id in cache:
        return cache[raw_id]

    decoded = decode_base64(raw_id)
    cache[raw_id] = decoded

    return decoded