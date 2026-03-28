from app.utils.decoder import decode_base64

def decode_node_id(raw_id):
    return decode_base64(raw_id)