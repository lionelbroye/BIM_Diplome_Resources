import smartpy as sp
class HelloWorld(sp.Contract):
	def __init__(self, valeur):
     	# mon storage contient un mot. Il peut être accéder avec self.data.nom_delavariable
    	self.init(phrase = valeur)
   	 

	@sp.entry_point
	def SetPhrase(self, nouvellePhrase):
    	self.data.phrase = nouvellePhrase


#Ici j'inscrit mes scenario de test
if "templates" not in __name__:
	@sp.add_test(name = "Scenario de test")
	def test():
     	#Je crée une instance de l'object HelloWorld (mon smartcontract défini plus haut) dans une variable appelé smartcontract
    	smartcontract = HelloWorld("coucou")
    	#je crée une nouvelle instance de scenario de test (spécifique a smartpy)
    	scenario = sp.test_scenario()
    	#j'affiche dans la console un titre
    	scenario.h1("Test du diplome")
    	#j'ajoute mon objet de smartcontract au scenario de test
    	scenario += smartcontract
    	#j'appelle la methode 'SetPhrase' de mon contrat
    	smartcontract.SetPhrase("coucou bim")
