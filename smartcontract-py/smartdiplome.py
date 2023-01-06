# J'importe la librairie smartpy, elle sera nommée sp 
import smartpy as sp

class SmartDiplome (sp.Contract):

    def __init__(self):
        self.init(
            authority = sp.address("tz1bpHvvwcSTgPrLMw8wcrHzMd2YRJCfPWLH"),
            legalText01 = "École Supérieure d'Art et de Design Orléans",
            legalText02 = "Diplôme Supérieur de Recherche en Design",
            legalText03 = "Vu la délibération du Conseil d'Administration de l'ÉSAD Orléans du 5 mars 2020",
            legalText04 = "Vu les pièces justificatives attestant de l'inscription de PRENOM_candidat_e NOM_candidat_e",
            legalText05 = "Vu le procès-verbal du jury attestant que PRENOM_candidat_e NOM_candidat_e a soutenu le DATE_smartdiplome des travaux de recherche de niveau 3e cycle portant sur : SUJET_recherche, préparés au sein de l'unité de recherche ECOLAB ;",
            legalText06 = "Vu la délibération du jury, composé de PRENOM_president_e NOM_president_e ; PRENOM_rapporteur_trice NOM_rapporteur_trice ; PRENOM_membreA NOM_membreA ; PRENOM_membreB NOM_membreB ; PRENOM_membreC NOM_membreC ; ",
            legalText07 = "Le Diplôme Supérieur de Recherche en Design de l'École Supérieure d'Art et de Design d'Orléans est délivré à PRENOM_candidat_e NOM_candidat_e ; ",
            legalText08 = "né·e le DATEDENAISSANCE_candidat_e ",
            legalText09 = "à LIEUDENAISSANCE_candidat_e",
            legalText10 = "Au titre de l'année DEBUT_année - FIN_année",
            legalText11 = "Fait à Orléans le DATE_édition",
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
        sp.verify(sp.sender==self.data.authority,"Vous n'êtes pas autorisé à délivrer de diplôme")
        self.data.history[sp.now] = NOM_candidat_e + " " + PRENOM_candidat_e+ " "+NOM_president_e+ " " + PRENOM_president_e+ " " + NOM_rapporteur_trice+ " " + NOM_membreA+ " " + PRENOM_membreA+ " " + NOM_membreB+ " " + PRENOM_membreB+ " " + NOM_membreC+ " " + PRENOM_membreC+ " " + DATE_smartdiplome + " " + DATENAISSANCE_candidat_e + " " + SUJET_recherche+ " " + LIEUNAISSANCE_candidat_e+ " " + DEBUT_annee+ " " + FIN_annee+ " " + DATE_edition
        

        

@sp.add_test(name = "Test SmartDiplome")
def Test():
    sd =  SmartDiplome()
    scenario = sp.test_scenario()
    scenario.h1('Deploiement du smartcontract')
    scenario += sd
    
