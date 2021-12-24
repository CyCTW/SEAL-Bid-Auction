from sage.all import *
from utils import randomOracle, init_schnorr_group

class stageOneProof:
    def __init__(self, cmt11 = 0, cmt12 = 0, cmt13 = 0, cmt14 = 0, 
          cmt21 = 0, cmt22 = 0, cmt23 = 0, cmt24 = 0, 
          ch1 = 0, ch2 = 0, r11 = 0, r12 = 0, r21 = 0, r22 = 0):
        self.commitment_11 = cmt11
        self.commitment_12 = cmt12
        self.commitment_13 = cmt13
        self.commitment_14 = cmt14

        self.commitment_21 = cmt21
        self.commitment_22 = cmt22
        self.commitment_23 = cmt23
        self.commitment_24 = cmt24

        self.challange_1 = ch1
        self.challange_2 = ch2

        self.response_11 = r11
        self.response_12 = r12
        self.response_21 = r21
        self.response_22 = r22

def verifyStageOneNZIKProof(proof, g, p, L, A, B, M, X, Y, R):
    """
    Verify the well-formedness of Stage one submission
    ----
    Input:
        proof: proof
        g: generator
        p: large prime modular
        L:
        A:
        B:
        M:
        X:
        Y:
        R:
    Output:
        res: verified result
    """
    def verify_1():
        left = pow(g, proof.response_11, p)
        right = proof.commitment_11 / pow(X, proof.challange_1, p)
        print("Verify 1...")
        return left == right
    def verify_2():
        left = pow(g, proof.response_12, p)
        right = proof.commitment_12 / pow(A, proof.challange_1, p)
        print("Verify 2...")
        return left == right 
    def verify_3():
        left = pow(Y, proof.response_11, p)
        right = proof.commitment_13 / pow(M, proof.challange_1, p)
        print("Verify 3...")
        return left == right 
    def verify_4():
        left = pow(B, proof.response_12, p)
        right = proof.commitment_14 / pow(L, proof.challange_1, p)
        print("Verify 4...")
        return left == right 
    def verify_5():
        left = pow(g, proof.response_21, p)
        right = proof.commitment_21 / pow(X, proof.challange_2, p)
        print("Verify 5...")
        return left == right 
    def verify_6():
        left = pow(g, proof.response_22, p)
        right = proof.commitment_22 / pow(A, proof.challange_2, p)
        print("Verify 6...")
        return left == right  
    def verify_7():
        left = pow(R, proof.response_21, p)
        right = proof.commitment_23 / pow(M, proof.challange_2, p)
        print("Verify 7...")
        return left == right 
    def verify_8():
        left = pow(B, proof.response_22, p)
        right = proof.commitment_24 / pow(L / g, proof.challange_2, p)
        print("Verify 8...")
        return left == right 
    
    return verify_1() and verify_2() and  verify_3() and verify_4() and \
        verify_5() and verify_6() and verify_7() and verify_8()
    
def generateStageOneNIZKProof(statement, g, p, q, a, x, L, A, B, M, X, Y, R, id):
    """
    Generate proof of well-formedness of StageOne.
    ---
    Input: 
        statement: Which statement to proof 
            0: g**(a*b)
            1: g**(a*b+1)
        g: generator
        q: order of generator
        p: large prime modular
        a:
        x:
        L:         
        A: 
        B:
        M:
        X:
        Y:
        R:
        id: user_id
    Output:
        Proof(challange1, challange2, Response1, Response2)
    """ 
    
    proof = stageOneProof()

    if statement == 0:
        r11 = randrange(1, q)
        r12 = randrange(1, q)
        r21 = randrange(1, q)
        r22 = randrange(1, q)
        ch2 = randrange(1, q)

        proof.commitment_11 = pow(g, r11, p)
        proof.commitment_12 = pow(g, r12, p)
        proof.commitment_13 = pow(Y, r11, p)
        proof.commitment_14 = pow(B, r12, p)

        proof.commitment_21 = pow(g, r21, p) * pow(X, ch2, p)
        proof.commitment_22 = pow(g, r22, p) * pow(A, ch2, p)
        proof.commitment_23 = pow(R, r21, p) * pow(M, ch2, p)
        proof.commitment_24 = pow(B, r22, p) * pow(L / g, ch2, p)
        ch = randomOracle(g, A, B, r11, r12, id) # H(g || y1 || y2 || r1 || r2 || id)
        ch1 = ch - ch2

        proof.challange_1 = ch1
        proof.challange_2 = ch2
        proof.response_11 = r11 - x * ch1
        proof.response_12 = r12 - a * ch1
        proof.response_21 = r21
        proof.response_22 = r22
    elif statement == 1:
        r11 = randrange(1, q)
        r12 = randrange(1, q)
        r21 = randrange(1, q)
        r22 = randrange(1, q)
        ch1 = randrange(1, q)

        proof.commitment_21 = pow(g, r21, p)
        proof.commitment_22 = pow(g, r22, p)
        proof.commitment_23 = pow(R, r21, p)
        proof.commitment_24 = pow(B, r22, p)

        proof.commitment_11 = pow(g, r11, p) * pow(X, ch1, p)
        proof.commitment_12 = pow(g, r12, p) * pow(A, ch1, p)
        proof.commitment_13 = pow(Y, r11, p) * pow(M, ch1, p)
        proof.commitment_14 = pow(B, r12, p) * pow(L, ch1, p)
        ch = randomOracle(g, A, B, r11, r12, id) # H(g || y1 || y2 || r1 || r2 || id)
        ch2 = ch - ch1

        proof.challange_1 = ch1
        proof.challange_2 = ch2
        proof.response_11 = r11 
        proof.response_12 = r12
        proof.response_21 = r21 - x * ch2
        proof.response_22 = r22 - a * ch2
    else:
        ...
    return proof

def compute_schnorr_signature():
    ...

q, r, p, h, g = init_schnorr_group()

x = randrange(1, q) # [1, q)
r = randrange(1, q) # [1, q)
a = randrange(1, q) # [1, q)
b = randrange(1, q) # [1, q)

X = pow(g, x, p)
R = pow(g, r, p)
A = pow(g, a, p)
B = pow(g, b, p)
# TODO: Modify Y to the actual formulation 
Y = pow(g, b, p)
# Y = compute_schnorr_signature()

for statement in [0, 1]:
    print(f"\nProve Statement {statement}...")
    L = pow(g, (a * b + statement), p) # ab
    M = 0
    if statement == 0:
        M = pow(Y, x, p)
    else:
        M = pow(R, x, p)
    id = randrange(100) # User id

    # Generate Commitment Proof
    proof = generateStageOneNIZKProof(statement, g, p, q, a, x, L, A, B, M, X, Y, R, id)
    res = verifyStageOneNZIKProof(proof, g, p, L, A, B, M, X, Y, R)

    if res: print("Sucess")
    else: print("Fail")    