# J'importe la librairie smartpy, ce qui me permet d'utiliser ses fonctions.
import smartpy as sp
 
class TUTONFT ( sp.Contract ):
 
    def __init__(self, artist, owner, price, now):
        self.init(Artist = artist, Owner = owner, 
        Price = price,Lastbought = now, MarketMode = 0, 
        authorizedOwner = owner, bidStartingPrice=sp.mutez(0), bidEndTime = now, bidders = sp.map(),
        bestBidder = owner, highestBid = sp.mutez(0))
 
    @sp.entry_point
    def SetPrice(self,newprice):
        sp.verify(sp.sender==self.data.Owner, "Only owner can change price")
        self.data.Price = newprice
 
    @sp.entry_point
    def Buy(self):
        sp.verify(self.data.MarketMode < 2, "Cannot purchase when bidding enabled")
        with sp.if_(self.data.MarketMode==0):
            sp.verify(sp.sender==self.data.authorizedOwner, "Not authorized")
 
        sp.verify(sp.now > self.data.Lastbought.add_seconds(60), "Wait before buy.")
        sp.verify(sp.sender!=self.data.Owner, "You already own this art")
        sp.verify(sp.amount >= self.data.Price, "Insuffisant price")
        # compute 30% of commission. 
        # We divide amount with 3. Result is opened as a pair of nat, mutez .
        # We store them in to variable : quotient and remainder 
        (quotient, remainder) = sp.match_pair(sp.ediv(sp.amount, sp.mutez(3)).open_some())
        commi = sp.utils.nat_to_mutez(quotient)
        # transfer commi to artist
        sp.send(self.data.Artist, commi, "Cannot sent tezos to artist")
        # transfer the rest to owner
        rest = sp.amount - commi
        sp.send(self.data.Owner, rest,  "Cannot sent tezos to owner")
        # Set new owner
        self.data.Owner = sp.sender
        self.data.Price = sp.amount + commi
        self.data.Lastbought = sp.now
 
    @sp.entry_point
    def SetInPrivateMode(self, authorizedAddress):
        sp.verify(sp.sender==self.data.Owner, "Only owner can set market mode")
        sp.verify(self.data.MarketMode < 2, "Failed when bidding enabled")
        self.data.MarketMode = 1
        self.data.authorizedOwner = authorizedAddress
 
    @sp.entry_point
    def SetInPublicMode(self):
        sp.verify(sp.sender==self.data.Owner, "Only owner can set market mode")
        sp.verify(self.data.MarketMode < 2, "Failed when bidding enabled")
        self.data.MarketMode = 0
 
    @sp.entry_point
    def StartNewBid(self, timeOffset, stPrice):
        sp.verify(self.data.MarketMode < 2, "Failed when bidding enabled")
        sp.verify(sp.sender==self.data.Owner, "Only owner can set market mode")
        self.data.bidders = sp.map()
        self.data.bidStartingPrice = stPrice
        self.data.bidEndTime = sp.now.add_seconds(timeOffset)
        self.data.MarketMode = 2
    
 
    @sp.entry_point
    def Bid(self):
        sp.verify(sp.sender!=self.data.Owner, "Owner not authorized to bid!")
        sp.verify(self.data.MarketMode == 2, "Bidding is not opened")
        sp.verify(self.data.bidEndTime > sp.now, "Bidding has ended")
        sp.verify(self.data.bidEndTime > sp.now, "Bidding has ended")
        sp.verify(self.data.bidders.contains(sp.sender) == False, "You already bid")
        sp.verify(self.data.bidStartingPrice <=  sp.amount, "Bid is not enough") 
        self.data.bidders[sp.sender] = sp.amount
        with sp.if_(sp.amount>self.data.highestBid):
            self.data.highestBid = sp.amount
            self.data.bestBidder = sp.sender
    
 
    @sp.entry_point
    def RetreiveBid(self):
        sp.verify(self.data.MarketMode == 2, "Bidding is not opened")
        sp.verify(self.data.bidEndTime < sp.now, "Bidding has not ended")
        sp.verify(self.data.bidders.contains(sp.sender) == True, "You haven't bid")
        with sp.if_(self.data.bestBidder==sp.sender):
            sp.send(self.data.Owner, self.data.bidders[sp.sender])
            self.data.Price = self.data.bidders[sp.sender]
            self.data.bidders[sp.sender] = sp.mutez(0)
            self.data.Owner = sp.sender
            self.data.Lastbought = sp.now
        with sp.else_():
            sp.send(sp.sender, self.data.bidders[sp.sender])
            self.data.bidders[sp.sender] = sp.mutez(0)
    @sp.entry_point
    def CloseBid(self):
        sp.verify(sp.sender==self.data.Owner, "Owner only to close bid!")
        sp.verify(self.data.bidEndTime.add_seconds(6000)< sp.now, "Cannot close bid. Wait...")
        self.data.MarketMode = 0
   
 
 
 
owner = sp.test_account("owner").address
buyer = sp.test_account("buyer").address
 
if "templates" not in __name__:
 
    @sp.add_test(name="NFT basic scenario", is_default=True)
    def basic_scenario():
        sc = sp.test_scenario()
        sc.h1("Basic scenario.")
        
 
        sc.h2("Origination:")
        now = sp.timestamp(0)
        c1 = TUTONFT(owner,owner,sp.mutez(0),now)
        sc += c1
 
        sc.h2("Set price:")
        c1.SetPrice(sp.mutez(60)).run(sender=owner, amount=sp.mutez(0), now=now)
 
        sc.h2("Try Buy from owner address")
        c1.Buy().run(sender=owner,amount=sp.mutez(5), now=now)
 
        sc.h2("Try Buy from other address but not enough amount")
        c1.Buy().run(sender=buyer, amount=sp.mutez(5), now=now)
 
        sc.h2("Try Buy with valid amount of Tezos")
        c1.Buy().run(sender=buyer, amount=sp.mutez(68), now=now)
 
 

