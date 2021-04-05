from datetime import datetime
import numpy as np
import fire
from web3 import Web3

w3 = Web3(Web3.WebsocketProvider())
w3.isConnected()

auction_maturity = datetime(2021, 3, 21, 23, 58, 15)
loan_amount = 100
loan_max_interest = 0.1
bids = []

def init_auction(auction_maturity, loan_amount, loan_max_interest):
    auction_maturity = datetime.strptime(auction_maturity, '%Y-%m-%d_%H:%M:%S')
    loan_amount = loan_amount
    loan_max_interest = loan_max_interest
    print("Loans initialised: Maturity: " + str(auction_maturity) + "Loan Amount: " + str(loan_amount) + "Loan max Interest: " + str(loan_max_interest))
    
def check_bid(bid_amount, bid_interest):
    if float(bid_amount) <= float(loan_amount) and float(bid_interest) <= float(loan_max_interest) and datetime.now() < auction_maturity:
        return [bid_amount, bid_interest]
    else: return False

def bid(amount, interest):
    amount = float(amount)
    interest = float(interest)
    if check_bid(amount, interest): bids.append(check_bid(amount, interest))
    else: print('unsuccessful bid')
    print("Bids: " + str(bids))

def end():
    bids = np.array(bids)
    if not bids.any() or bids[:, 0].sum() < loan_amount: print("Unsuccessful auction")
    else: 
        print('Successful Auction')
        bids = bids[bids[:, 1].argsort()]
        loan_bids = bids[bids[:, 0].cumsum() <= loan_amount].tolist()
        print('Successful full bids for the loan: ' + str(loan_bids))
        loan_bids_a = np.array(loan_bids)
        missing = loan_amount - loan_bids_a[:, 0].sum()
        bids[len(loan_bids)][0] = missing
        print('Successful filling bid: ' + str(list(bids[len(loan_bids)])))
        loan_bids.append(bids[len(loan_bids)].tolist())
        print('Successful bids for the loan: ' + str(loan_bids))
        loan_bids = np.array(loan_bids)
        amount = loan_bids[:,0]
        weights = amount / amount.sum()
        data = loan_bids[:,1]
        wt_avg = (data * weights).sum() / weights.sum()
        print('The interest for the loan is: ' + str(wt_avg))


if __name__ == '__main__':
    #fire.Fire(init_auction)
    fire.Fire(bid)
    fire.Fire(end)