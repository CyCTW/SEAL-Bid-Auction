import hashlib
from sage.all import *


def randomOracle(*args):
    m = hashlib.sha256()
    message = ""
    for ele in args:
        message += str(ele)
    m.update(message.encode())
    return int(m.hexdigest(), 16)


def init_schnorr_group():
    def generate_q_r_p():
        q = random_prime(2**128)
        r = randrange(1, 2**128)
        p = q * r + 1
        return q, r, p

    q, r, p = generate_q_r_p()
    while not is_prime(p) or not is_prime(q):
        q, r, p = generate_q_r_p()

    h = randrange(2, p)
    while pow(h, r, p) == 1:
        h = randrange(2, p)
        
    g = pow(h, r, p)

    return q, r, p, h, g