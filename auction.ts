//npx ts-node auction.ts

import { number } from "prop-types";

let date: Date = new Date(); 
let auction_maturity: Date = new Date("2021-05-27");
console.log(date);
console.log(auction_maturity);

let loan_amount: number = 100;
let loan_max_interest: number = 0.1;

var bids_amount: number[];
var bids_interest: number[];

function initAuction(auction_maturity: Date, loan_amount: number, loan_max_interest: number){
    auction_maturity = auction_maturity;
    loan_amount = loan_amount;
    loan_max_interest = loan_max_interest;
    console.log("Loans initialised: Maturity: " + auction_maturity.toString() + "Loan Amount: " + loan_amount.toString() + "Loan max Interest: " + loan_max_interest.toString());
}

function checkBid(bid_amount: number, bid_interest: number) {
    if (bid_amount <= loan_amount && bid_interest <= loan_max_interest && date <= auction_maturity){
        console.log(bid_amount);
        return [bid_amount, bid_interest];
    }
    else {
        return [NaN, NaN];
    }
}

function bid(amount: number, interest: number){
    let checked_bid = checkBid(amount, interest);
    console.log(checked_bid);
    if (checked_bid[0] != NaN || checked_bid[1] != NaN) {
        bids_amount.push(checked_bid[0]);
        bids_interest.push(checked_bid[1]);
    }
    else {
        console.log('unsuccessful bid')
        console.log("Bids: " + bids_amount.toString())
    }
}

function sortFunction(a: number[], b: number[]) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

function finishAuction(){
    let bids: number[][];

    const cumulativeSum = (sum => value => sum += value)(0);

    if (bids_amount.length !== 0 || 
        bids_amount.reduce((a, b) => {return a + b;}) < loan_amount) { 
        console.log("Unsuccessful Auction");
    }
    else {
        console.log('Successful Auction');
        
        for (let i = 0; i < bids_amount.length; i++) {
            bids[i][0] = bids_amount[i]
            bids[i][1] = bids_interest[i];
        }
        
        let bids_sorted = bids.sort(sortFunction);
        let bids_amount_sorted: number[];
        let bids_interest_sorted: number[];
        let full_bids_amount: any;
    
        var pos: number;
        for (let pos = 0; pos < bids_sorted.length; pos++) {
            full_bids_amount = bids_amount_sorted.map(cumulativeSum)
            if (full_bids_amount <= loan_amount) {
                bids_amount_sorted.push(bids_sorted[pos][0]);
                bids_interest_sorted.push(bids_sorted[pos][1]);
            }
            else {
                break;
            }
        }
        let amount_partial_bid: number = bids_amount_sorted[pos+1] + full_bids_amount - loan_amount;
        let interest_partial_bid: number = bids_interest_sorted[pos+1];
        bids_amount_sorted.push(amount_partial_bid[pos+1][0]);
        bids_interest_sorted.push(interest_partial_bid[pos+1][1]);
    }
}

bid(50, 0.05);
bid(60, 0.07);
finishAuction();