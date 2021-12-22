
import hashlib
from sage.all import *


class commitmentNIZKProof:
    def __init__(self, cmt11 = 0, cmt12 = 0, cmt21 = 0, cmt22 = 0, ch1 = 0, ch2 = 0, r1 = 0, r2 = 0):
        self.commitment_11 = cmt11
        self.commitment_12 = cmt12
        self.commitment_21 = cmt21
        self.commitment_22 = cmt22
        self.challange_1 = ch1
        self.challange_2 = ch2
        self.response_1 = r1
        self.response_2 = r2

def randomOracle(*args):
    m = hashlib.sha256()
    message = ""
    for ele in args:
        message += str(ele)
    m.update(message.encode())
    return int(m.hexdigest(), 16)

def verifyCommitmentNIZKProof(proof, g, p, L, A, B):
    """
    Verify the well-formedness of commitment
    ----
    Input:
    proof: proof
    generator: g
    module: q
    g**(a*b): L
    g**a: A
    g**b: B
    """
    def verify_1():
        left = pow(g, proof.response_1, p)
        right = proof.commitment_11 / pow(A, proof.challange_1, p)
        print("Verify 1...")
        return left == right 

    def verify_2(): 
        left = pow(B, proof.response_1, p)
        right = proof.commitment_12 / pow(L, proof.challange_1, p)
        print("Verify 2...")
        return left == right
    
    def verify_3(): 
        left = pow(g, proof.response_2, p)
        right = proof.commitment_21 / pow(A, proof.challange_2, p)
        print("Verify 3...")
        return left == right
    
    def verify_4(): 
        left = pow(B, proof.response_2, p)
        right = proof.commitment_22 / pow(L / g, proof.challange_2, p)
        print("Verify 4...")
        return left == right
    
    return verify_1() and verify_2() and verify_3() and verify_4()


def generateCommitmentNIZKProof(statement, g, p, a, b, id):# => {
    """
    Generate proof of well-formedness of commitment.
    ---
    Input: 
    statement: Which statement to proof 
      0: g**(a*b)
      1: g**(a*b+1)
    g: generator
    a: alpha
    b: beta
    q: module
    Output:
    Proof(challange1, challange2, Response1, Response2)
    """ 
    
    proof = commitmentNIZKProof()

    if statement == 0:
        r1 = randrange(1, p)
        r2 = randrange(1, p)
        ch2 = randrange(1, p)

        proof.commitment_11 = pow(g, r1, p)
        proof.commitment_12 = pow(g, b * r1, p)
        proof.commitment_21 = pow(g, r2, p) * pow(g, a * ch2, p)
        proof.commitment_22 = pow(g, b * r2, p) * pow(g, (a * b - 1) * ch2, p )
        ch = randomOracle(g, pow(g, a, p), pow(g, b, p), r1, r2, id) # H(g || y1 || y2 || r1 || r2 || id)
        ch1 = ch - ch2

        proof.challange_1 = ch1
        proof.challange_2 = ch2
        proof.response_1 = r1 - a * ch1
        proof.response_2 = r2
    elif statement == 1:
        r1 = randrange(1, p)
        r2 = randrange(1, p)
        ch1 = randrange(1, p)

        proof.commitment_21 = pow(g, r1, p)
        proof.commitment_22 = pow(g, b * r1, p)
        proof.commitment_11 = pow(g, r2, p) * pow(g, a * ch1, p)
        proof.commitment_12 = pow(g, b * r2, p) * pow(g, (a * b + 1) * ch1, p)
        ch = randomOracle(g, pow(g, a, p), pow(g, b, p), r1, r2, id) # H(g || y1 || y2 || r1 || r2 || id)
        ch2 = ch - ch1

        proof.challange_1 = ch1
        proof.challange_2 = ch2
        proof.response_2 = r1 - a * ch2
        proof.response_1 = r2
    else:
        ...
    return proof

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

# Initialization
q, r, p, h, g = init_schnorr_group()
alpha = randrange(1, p) # [1, p)
beta = randrange(1, p) # [1, p)
A = pow(g, alpha, p)
B = pow(g, beta, p)

for statement in [0, 1]:
    print(f"\nProve Statement {statement}...")
    L = pow(g, (alpha * beta + statement), p)
    
    id = randrange(100) # User id

    # Generate Commitment Proof
    proof = generateCommitmentNIZKProof(statement, g, p, alpha, beta, id)
    res = verifyCommitmentNIZKProof(proof, g, p, L, A, B)

    if res: print("Sucess")
    else: print("Fail")