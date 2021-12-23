from sage.all import *
from utils import randomOracle

class stageOneProof:
    def __init__(self, cmt11 = 0, cmt12 = 0, cmt13 = 0, cmt14 = 0, 
          cmt21 = 0, cmt22 = 0, cmt23 = 0, cmt24 = 0, 
          ch1 = 0, ch2 = 0, r1 = 0, r2 = 0, r3 = 0, r4 = 0):
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

        self.response_1 = r1
        self.response_2 = r2
        self.response_3 = r3
        self.response_4 = r4

def verifyStageOneNZIKProof(proof, g, q, L, A, B):
    """
    Verify the well-formedness of stage one data
    ---
    Input:
        proof: proof
        
    """
    
    