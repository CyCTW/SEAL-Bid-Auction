from sage.all import *
from utils import randomOracle, init_schnorr_group

class stageTwoProof:
    def __init__(self, cmt11 = 0, cmt12 = 0, cmt13 = 0, cmt11_ = 0, cmt12_ = 0, cmt13_ = 0,
          cmt21 = 0, cmt22 = 0, cmt23 = 0, cmt21_ = 0, cmt22_ = 0, cmt23_ = 0,
          cmt31 = 0, cmt32 = 0, cmt33 = 0, cmt31_ = 0, cmt32_ = 0, cmt33_ = 0,
          ch1 = 0, ch2 = 0, ch3 = 0, r11 = 0, r12 = 0, r13 = 0, r21 = 0, r22 = 0, r23 = 0, r31 = 0, r32 = 0):
        self.commitment_11 = cmt11
        self.commitment_12 = cmt12
        self.commitment_13 = cmt13
        
        self.commitment_11_ = cmt11_
        self.commitment_12_ = cmt12_
        self.commitment_13_ = cmt13_

        self.commitment_21 = cmt21
        self.commitment_22 = cmt22
        self.commitment_23 = cmt23

        self.commitment_21_ = cmt21_
        self.commitment_22_ = cmt22_
        self.commitment_23_ = cmt23_

        self.commitment_31 = cmt31
        self.commitment_32 = cmt32
        self.commitment_33 = cmt33

        self.commitment_31_ = cmt31_
        self.commitment_32_ = cmt32_
        self.commitment_33_ = cmt33_

        self.challange_1 = ch1
        self.challange_2 = ch2
        self.challange_3 = ch3

        self.response_11 = r11
        self.response_12 = r12
        self.response_13 = r13
        self.response_21 = r21
        self.response_22 = r22
        self.response_23 = r23
        self.response_31 = r31
        self.response_32 = r32

def verifyStageTwoNZIKProof(proof, g, p, L, A, B, M, X, Y, R, M_, X_, Y_, R_):
    """
    Verify the well-formedness of Stage two submission
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
        right = proof.commitment_12 / pow(X_, proof.challange_1, p)
        print("Verify 2...")
        return left == right 

    def verify_3():
        left = pow(g, proof.response_13, p)
        right = proof.commitment_13 / pow(A, proof.challange_1, p)
        print("Verify 3...")
        return left == right 
        
    def verify_4():
        left = pow(R, proof.response_11, p)
        right = proof.commitment_11_ / pow(M, proof.challange_1, p)
        print("Verify 4...")
        return left == right 

    def verify_5():
        left = pow(R_, proof.response_12, p)
        right = proof.commitment_12_ / pow(M_, proof.challange_1, p)
        print("Verify 5...")
        return left == right 

    def verify_6():
        left = pow(B, proof.response_13, p)
        right = proof.commitment_13_ / pow(L / g, proof.challange_1, p)
        print("Verify 6...")
        return left == right  

    def verify_7():
        left = pow(g, proof.response_21, p)
        right = proof.commitment_21 / pow(X, proof.challange_2, p)
        print("Verify 7...")
        return left == right 

    def verify_8():
        left = pow(g, proof.response_22, p)
        right = proof.commitment_22 / pow(X_, proof.challange_2, p)
        print("Verify 8...")
        return left == right 
    
    def verify_9():
        left = pow(g, proof.response_23, p)
        right = proof.commitment_23 / pow(A, proof.challange_2, p)
        print("Verify 9...")
        return left == right

    def verify_10():
        left = pow(Y, proof.response_21, p)
        right = proof.commitment_21_ / pow(M, proof.challange_2, p)
        print("Verify 10...")
        return left == right 

    def verify_11():
        left = pow(R_, proof.response_22, p)
        right = proof.commitment_22_ / pow(M_, proof.challange_2, p)
        print("Verify 11...")
        return left == right 
        
    def verify_12():
        left = pow(B, proof.response_23, p)
        right = proof.commitment_23_ / pow(L, proof.challange_2, p)
        print("Verify 12...")
        return left == right 

    def verify_13():
        left = pow(g, proof.response_31, p)
        right = proof.commitment_31 / pow(X, proof.challange_3, p)
        print("Verify 13...")
        return left == right 

    def verify_14():
        left = pow(g, proof.response_32, p)
        right = proof.commitment_32 / pow(X_, proof.challange_3, p)
        print("Verify 14...")
        return left == right  

    def verify_15():
        left = pow(Y, proof.response_31, p)
        right = proof.commitment_31_ / pow(M, proof.challange_3, p)
        print("Verify 15...")
        return left == right 

    def verify_16():
        left = pow(Y_, proof.response_32, p)
        right = proof.commitment_32_ / pow(M_, proof.challange_3, p)
        print("Verify 16...")
        return left == right 
    
    return verify_1() and verify_2() and  verify_3() and verify_4() and \
        verify_5() and verify_6() and verify_7() and verify_8() and \
        verify_9() and verify_10() and verify_11() and verify_12() and \
        verify_13() and verify_14() and verify_15() and verify_16()

    
def generateStageTwoNIZKProof(statement, g, p, q, a, x, x_, L, A, B, M, X, Y, R, M_, X_, Y_, R_, id):
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
    
    proof = stageTwoProof()

    if statement == 0:
        r11 = randrange(1, q)
        r12 = randrange(1, q)
        r13 = randrange(1, q)
        r21 = randrange(1, q)
        r22 = randrange(1, q)
        r23 = randrange(1, q)
        r31 = randrange(1, q)
        r32 = randrange(1, q)
        ch2 = randrange(1, q)
        ch3 = randrange(1, q)

        proof.commitment_11 = pow(g, r11, p)
        proof.commitment_12 = pow(g, r12, p)
        proof.commitment_13 = pow(g, r13, p)
        proof.commitment_11_ = pow(R, r11, p)
        proof.commitment_12_ = pow(R_, r12, p)
        proof.commitment_13_ = pow(B, r13, p)

        proof.commitment_21 = pow(g, r21, p) * pow(X, ch2, p)
        proof.commitment_22 = pow(g, r22, p) * pow(X_, ch2, p)
        proof.commitment_23 = pow(g, r23, p) * pow(A, ch2, p)
        proof.commitment_21_ = pow(Y, r21, p) * pow(M, ch2, p)
        proof.commitment_22_ = pow(R_, r22, p) * pow(M_, ch2, p)
        proof.commitment_23_ = pow(B, r23, p) * pow(L, ch2, p)

        proof.commitment_31 = pow(g, r31, p) * pow(X, ch3, p)
        proof.commitment_32 = pow(g, r32, p) * pow(X_, ch3, p)
        proof.commitment_31_ = pow(Y, r31, p) * pow(M, ch3, p)
        proof.commitment_32_ = pow(Y_, r32, p) * pow(M_, ch3, p)

        ch = randomOracle(g, A, B, r11, r12, id) # H(g || y1 || y2 || r1 || r2 || id)
        ch1 = ch - ch2 - ch3

        proof.challange_1 = ch1
        proof.challange_2 = ch2
        proof.challange_3 = ch3
        proof.response_11 = r11 - x * ch1
        proof.response_12 = r12 - x_ * ch1
        proof.response_13 = r13 - a * ch1
        proof.response_21 = r21
        proof.response_22 = r22
        proof.response_23 = r23
        proof.response_31 = r31
        proof.response_32 = r32
    elif statement == 1:
        r11 = randrange(1, q)
        r12 = randrange(1, q)
        r13 = randrange(1, q)
        r21 = randrange(1, q)
        r22 = randrange(1, q)
        r23 = randrange(1, q)
        r31 = randrange(1, q)
        r32 = randrange(1, q)
        ch1 = randrange(1, q)
        ch3 = randrange(1, q)

        proof.commitment_21 = pow(g, r21, p)
        proof.commitment_22 = pow(g, r22, p)
        proof.commitment_23 = pow(g, r23, p)
        proof.commitment_21_ = pow(Y, r21, p)
        proof.commitment_22_ = pow(R_, r22, p)
        proof.commitment_23_ = pow(B, r23, p)

        proof.commitment_11 = pow(g, r11, p) * pow(X, ch1, p)
        proof.commitment_12 = pow(g, r12, p) * pow(X_, ch1, p)
        proof.commitment_13 = pow(g, r13, p) * pow(A, ch1, p)
        proof.commitment_11_ = pow(R, r11, p) * pow(M, ch1, p)
        proof.commitment_12_ = pow(R_, r12, p) * pow(M_, ch1, p)
        proof.commitment_13_ = pow(B, r13, p) * pow(L/g, ch1, p)

        proof.commitment_31 = pow(g, r31, p) * pow(X, ch3, p)
        proof.commitment_32 = pow(g, r32, p) * pow(X_, ch3, p)
        proof.commitment_31_ = pow(Y, r31, p) * pow(M, ch3, p)
        proof.commitment_32_ = pow(Y_, r32, p) * pow(M_, ch3, p)

        ch = randomOracle(g, A, B, r11, r12, id) # H(g || y1 || y2 || r1 || r2 || id)
        ch2 = ch - ch1 - ch3

        proof.challange_1 = ch1
        proof.challange_2 = ch2
        proof.challange_3 = ch3
        proof.response_11 = r11 
        proof.response_12 = r12
        proof.response_13 = r13
        proof.response_21 = r21 - x * ch2
        proof.response_22 = r22 - x_ * ch2
        proof.response_23 = r23 - a * ch2
        proof.response_31 = r31
        proof.response_32 = r32
    elif statement == 2:
        r11 = randrange(1, q)
        r12 = randrange(1, q)
        r13 = randrange(1, q)
        r21 = randrange(1, q)
        r22 = randrange(1, q)
        r23 = randrange(1, q)
        r31 = randrange(1, q)
        r32 = randrange(1, q)
        ch1 = randrange(1, q)
        ch2 = randrange(1, q)

        proof.commitment_11 = pow(g, r11, p) * pow(X, ch1, p)
        proof.commitment_12 = pow(g, r12, p) * pow(X_, ch1, p)
        proof.commitment_13 = pow(g, r13, p) * pow(A, ch1, p)
        proof.commitment_11_ = pow(R, r11, p) * pow(M, ch1, p)
        proof.commitment_12_ = pow(R_, r12, p) * pow(M_, ch1, p)
        proof.commitment_13_ = pow(B, r13, p) * pow(L/g, ch1, p)

        proof.commitment_21 = pow(g, r21, p) * pow(X, ch2, p)
        proof.commitment_22 = pow(g, r22, p) * pow(X_, ch2, p)
        proof.commitment_23 = pow(g, r23, p) * pow(A, ch2, p)
        proof.commitment_21_ = pow(Y, r21, p) * pow(M, ch2, p)
        proof.commitment_22_ = pow(R_, r22, p) * pow(M_, ch2, p)
        proof.commitment_23_ = pow(B, r23, p) * pow(L, ch2, p)

        proof.commitment_31 = pow(g, r31, p) 
        proof.commitment_32 = pow(g, r32, p) 
        proof.commitment_31_ = pow(Y, r31, p) 
        proof.commitment_32_ = pow(Y_, r32, p) 

        ch = randomOracle(g, A, B, r11, r12, id) # H(g || y1 || y2 || r1 || r2 || id)
        ch3 = ch - ch1 - ch2

        proof.challange_1 = ch1
        proof.challange_2 = ch2
        proof.challange_3 = ch3
        proof.response_11 = r11 
        proof.response_12 = r12
        proof.response_13 = r13
        proof.response_21 = r21 
        proof.response_22 = r22 
        proof.response_23 = r23 
        proof.response_31 = r31 - x * ch3
        proof.response_32 = r32 - x_ * ch3
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
# TODO: Modify Y, Y_ to the actual formulation 
Y = pow(g, b, p)
Y_ = pow(g, b, p)

x_ = randrange(1, q) # [1, q)
r_ = randrange(1, q) # [1, q)
X_ = pow(g, x_, p)
R_ = pow(g, r_, p)
# Y = compute_schnorr_signature()

for statement in [0, 1, 2]:
    print(f"\nProve Statement {statement}...")
    # L = pow(g, (a * b + statement), p) # ab
    L, M, M_ = 0, 0, 0
    if statement == 0:
        M = pow(R, x, p)
        M_ = pow(R_, x_, p)
        L = pow(g, (a * b + 1), p) 

    elif statement == 1:
        M = pow(Y, x, p)
        M_ = pow(R_, x_, p)
        L = pow(g, (a * b), p) 

    elif statement == 2:
        M = pow(Y, x, p)
        M_ = pow(Y_, x_, p)
        L = pow(g, (a * b), p) # random 
    id = randrange(100) # User id

    # Generate Commitment Proof
    proof = generateStageTwoNIZKProof(statement, g, p, q, a, x, x_, L, A, B, M, X, Y, R, M_, X_, Y_, R_, id)
    res = verifyStageTwoNZIKProof(proof, g, p, L, A, B, M, X, Y, R, M_, X_, Y_, R_)

    if res: print("Sucess")
    else: print("Fail")    