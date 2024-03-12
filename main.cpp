#include <iostream>
#include <fstream>
#include <cstdlib>
#include <vector>
#include <string>
#define ATRIBUTOS_FILE "AtributosJuego.txt"
#define JUEGO_FILE "Juego.txt"
using namespace std;

vector<string> split(string str, char pattern) {

    int posInit = 0;
    int posFound = 0;
    string splitted;
    vector<string> results;

    while (posFound >= 0) {
        posFound = str.find(pattern, posInit);
        splitted = str.substr(posInit, posFound - posInit);
        posInit = posFound + 1;
        results.push_back(splitted);
    }

    return results;
}


 void cargarDatos(){

     int tamaño = 20;


     ifstream ficheroAtrib;
     ficheroAtrib.open(ATRIBUTOS_FILE);
     if (ficheroAtrib.is_open()) {
         vector<string> auxVector;
         while (!ficheroAtrib.eof()) {
             string aux;
             ficheroAtrib >> aux;
             auxVector = split(aux, ',');
         }
         ficheroAtrib.close();
         for (int k = 0; k < auxVector.size(); k++) {
             cout << auxVector[k];
             for (int z = 0; z < tamaño - auxVector[k].length(); z++) {
                 cout << " ";
             }
             cout << "|";
         }
         cout << "\n";
     }
     
     cout << "---------------------------------------------------------------------------------------------------------";
     cout << "\n";
    ifstream fichero;
    fichero.open(JUEGO_FILE);
    if (fichero.is_open()) {
        string aux;
        vector<vector<string>> v;
        while (!fichero.eof()) {
            vector<string> auxVector;
            fichero >> aux;
            auxVector = split(aux, ',');
            v.push_back(auxVector);
        }
        fichero.close();
        
        for (int i = 0; i < v.size(); i++) {
            for (int j = 0; j < v[i].size(); j++) {
                cout << "" << v[i][j];
                for (int z = 0; z < tamaño - v[i][j].length(); z++) {
                    cout << " ";
                }
                cout << "|";
            }
            cout << "\n";
        }
    }
    
 }

int main(){
    cargarDatos();
    return 0;
 }


