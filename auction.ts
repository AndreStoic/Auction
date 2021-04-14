//npx ts-node auction.ts

import { number } from "prop-types";

let date: Date = new Date(); 
let auction_maturity: Date;
console.log(date);

let loan_amount: number;
let loan_max_interest: number;

let bids_amount = new Array();
let bids_interest = new Array();

function initAuction(auction_maturity_p: Date, loan_amount_p: number, loan_max_interest_p: number) {
    loan_amount = loan_amount_p;
    loan_max_interest = loan_max_interest_p;
    auction_maturity = auction_maturity_p;
    console.log("Loans initialised: Maturity: " + auction_maturity.toString() + " | Loan Amount: " + 
                loan_amount.toString() + " | Loan max Interest: " + loan_max_interest.toString());
}

function checkBid(bid_amount: number, bid_interest: number) {
    if (bid_amount <= loan_amount && bid_interest <= loan_max_interest && date <= auction_maturity) {
        return [bid_amount, bid_interest];
    }
    else {
        return [NaN, NaN];
    }
}

function bid(amount: number, interest: number) {
    let checked_bid = checkBid(amount, interest);
    if (checked_bid[0] != NaN || checked_bid[1] != NaN) {
        console.log(checked_bid);
        bids_amount.push(checked_bid[0]);
        bids_interest.push(checked_bid[1]);
        console.log('successful bid')
        console.log("Bids: " + bids_amount.toString())
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

// to add: make sure that sort works for same interest but different times (second precision)
function finishAuction(){
    let bids = new Array();
    if (bids_amount.length === 0 || 
        bids_amount.reduce((a, b) => {return a + b;}) < loan_amount) { 
        console.log("Unsuccessful Auction");
    }
    else {
        console.log('Successful Auction');
        
        for (let i = 0; i < bids_amount.length; i++) {
            let bid = [bids_interest[i], bids_amount[i]];
            bids[i] = bid;
        }
        let bids_sorted = bids.sort(sortFunction);
        let bids_amount_sorted = new Array();
        let bids_interest_sorted = new Array();
        let full_bids_amount: number = 0;
        console.log(bids_sorted)
        var pos: number = 0;
        for (var i = 0; i < bids_sorted.length; i++) {
            pos = i;
            let pos_bid: number = +bids_sorted[i][1];
            bids_amount_sorted.push(pos_bid);
            bids_interest_sorted.push(+bids_sorted[i][0]);
            if (full_bids_amount + pos_bid <= loan_amount) {
                full_bids_amount += +bids_sorted[i][1]; //cast string to float
            }
            else {
                break;
            }
        }
        let amount_partial_bid: number = loan_amount - full_bids_amount;
        let interest_partial_bid: number = bids_interest_sorted[pos];
        bids_amount_sorted.splice(-1,1);
        bids_interest_sorted.splice(-1,1);
        bids_amount_sorted.push(amount_partial_bid);
        bids_interest_sorted.push(interest_partial_bid);
        console.log(bids_amount_sorted);
        console.log(bids_interest_sorted);
    }
}

// @ts-check
function init() {
    initAuction(new Date("2021-05-27"), 100, 0.1);
    console.log(loan_amount)
    console.log(loan_max_interest)
    bid(50, 0.03);
    bid(60, 0.04);
    bid(10, 0.03);
    finishAuction();
}
init();