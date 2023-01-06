# J'importe smartpy pour pouvoir utiliser ses fonctionnalités
import smartpy as sp
 
# Ce smartcontract contient 
class Diplome(sp.Contract):
    def __init__(self, titre, nom, date_naissance, ville_naissance, authority, date, mention, beneficiaire):
        # J'inscris ici toutes les informations contenues dans le diplôme.
        # Toutes ces informations seront les seules données visibles et accessibles du contrat
        self.init(
            titre = titre,
            nom = nom,
            date_naissance = date_naissance,
            ville_naissance = ville_naissance,
            authorite = authority,
            date_remise = date,
            mention = mention,
            beneficiaire = beneficiaire,
            signature_authorite = "",
            signature_beneficiaire = "",
            certification = False)
 
        
    # Cette fonction laisse le beneficiaire approuver la certification et deposer sa signature
    @sp.entry_point
    def Signer(self, signature):
        sp.verify(sp.sender==self.data.beneficiaire, "Seul le beneficiaire peut signer le document")
        self.data.signature_beneficiaire = signature
        
    # Cette fonction laisse l'authorite approuver la validité du document et deposer une signature
    @ sp.entry_point
    def Valider(self, signature):
        sp.verify(self.data.signature_beneficiaire != "", "Le beneficiaire doit premierement signer")
        sp.verify(sp.sender==self.data.authorite, "Seul l'authorite peut valider le document")
        self.data.signature_authorite = signature
        date_remise = sp.now
        self.data.certification = True
 
    
 
 
 
 
if "templates" not in __name__:
    @sp.add_test(name = "Diplome")
    def test():
        # J'inscris les informations principales ici
        titre = "Diplome en master design media"
        nom   =  "Gael Goutard"
        date_naissance = "24 12 1994"
        ville_naissance = "Caen"
        date = sp.timestamp(0)
        mention = "Nul"
        #  L'addresse ici est fausse. Copiez l'adresse du porte-monnaie de l'établissement faisant
        #  authorité sur la délivrance des diplômes
        addresseAuthorite = sp.address("tz1XkjeKr5ZrASvQoCBFE7jFc7BGiE4jTRc6");
        #  L'adresse ici est fausse. Copiez l'adresse du diplômé ici
        addresseBeneficiaire = sp.address("tz1XkjeKr5ZrASvQoCBFE7jFc7BGiE4jTRc6");
        addresseIntru = sp.test_account("perturbateur").address
        c1 = Diplome(titre,nom,date_naissance,ville_naissance,addresseAuthorite, date, mention,addresseBeneficiaire)
        scenario = sp.test_scenario()
        scenario.h1("Diplome")
        scenario += c1
        # Je teste different scenario ici. 
        scenario.h1("Je signe mon diplome")
        # Je signe mon diplôme non pas de ma main mais par un mot. Ici GG4EVER. Ce champs de signature
        # est libre
        c1.Signer("GG4EVER").run(sender=addresseBeneficiaire, amount=sp.mutez(0), now = date)
        scenario.h1("Le diplôme tente d'être certifié par une tierce personne")
        c1.Valider("imcrying").run(sender=addresseIntru, amount=sp.mutez(0), now = date)
        scenario.h1("Le diplôme est certifié par l'authorite et scellé dans le temps")
        # L'autorithé signe mon diplôme par un mot. Ici esad@orleans. Ce champs de signature
        # est libre. Ces signatures ne sont là que pour une lecture humaine.
        c1.Valider("esad@orleans").run(sender=addresseAuthorite, amount=sp.mutez(0), now = date)