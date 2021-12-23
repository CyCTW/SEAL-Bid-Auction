import hashlib


def randomOracle(*args):
    m = hashlib.sha256()
    message = ""
    for ele in args:
        message += str(ele)
    m.update(message.encode())
    return int(m.hexdigest(), 16)