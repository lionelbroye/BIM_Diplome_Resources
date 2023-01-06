# adresse du contrat dans le ghostnet : https://smartpy.io/explorer?address=KT1HLk6LmWmMxX8VA2kumNkgPqvjojgXyA29
# J importe la librairie smartpy, elle sera nommee sp 
import smartpy as sp

class SmartDiplome (sp.Contract):

    def __init__(self):
        self.init(
            authority = sp.address("tz1bpHvvwcSTgPrLMw8wcrHzMd2YRJCfPWLH"),
            legalText01 = "ecole Superieure d Art et de Design Orleans",
            legalText02 = "Diplome Superieur de Recherche en Design",
            legalText03 = "Vu la deliberation du Conseil d Administration de l eSAD Orleans du 5 mars 2020",
            legalText04 = "Vu les pieces justificatives attestant de l inscription de PRENOM_candidat_e NOM_candidat_e",
            legalText05 = "Vu le proces-verbal du jury attestant que PRENOM_candidat_e NOM_candidat_e a soutenu le DATE_smartdiplome des travaux de recherche de niveau 3e cycle portant sur : SUJET_recherche, prepares au sein de l unite de recherche ECOLAB   ",
            legalText06 = "Vu la deliberation du jury, compose de PRENOM_president_e NOM_president_e    PRENOM_rapporteur_trice NOM_rapporteur_trice    PRENOM_membreA NOM_membreA    PRENOM_membreB NOM_membreB    PRENOM_membreC NOM_membreC    ",
            legalText07 = "Le Diplome Superieur de Recherche en Design de l ecole Superieure d Art et de Design d Orleans est delivre a PRENOM_candidat_e NOM_candidat_e    ",
            legalText08 = "ne-e le DATEDENAISSANCE_candidat_e ",
            legalText09 = "a LIEUDENAISSANCE_candidat_e",
            legalText10 = "Au titre de l annee DEBUT_annee - FIN_annee",
            legalText11 = "Fait a Orleans le DATE_edition",
            history = sp.map()
        )
   
    @sp.entry_point
    def DelivranceDiplome(self, 
                          NOM_candidat_e,
                          PRENOM_candidat_e, 
                          NOM_president_e,
                          PRENOM_president_e,
                          NOM_rapporteur_trice,
                          PRENOM_rapporteur_trice,
                          NOM_membreA,
                          PRENOM_membreA,
                          NOM_membreB,
                          PRENOM_membreB,
                          NOM_membreC,
                          PRENOM_membreC,
                          DATE_smartdiplome,
                          DATENAISSANCE_candidat_e,
                          SUJET_recherche,
                          LIEUNAISSANCE_candidat_e,
                          DEBUT_annee,
                          FIN_annee,
                          DATE_edition
                          ):
        sp.verify(sp.sender==self.data.authority,"Vous n etes pas autorise a delivrer de Diplome")
        self.data.history[sp.now] = NOM_candidat_e + " " + PRENOM_candidat_e+ " "+NOM_president_e+ " " + PRENOM_president_e+ " " + NOM_rapporteur_trice+ " " + NOM_membreA+ " " + PRENOM_membreA+ " " + NOM_membreB+ " " + PRENOM_membreB+ " " + NOM_membreC+ " " + PRENOM_membreC+ " " + DATE_smartdiplome + " " + DATENAISSANCE_candidat_e + " " + SUJET_recherche+ " " + LIEUNAISSANCE_candidat_e+ " " + DEBUT_annee+ " " + FIN_annee+ " " + DATE_edition
        

        

@sp.add_test(name = "Test SmartDiplome")
def Test():
    sd =  SmartDiplome()
    scenario = sp.test_scenario()
    scenario.h1(" Deploiement du smartcontract ")
    scenario += sd
    
