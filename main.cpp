#include <iostream>
#include <fstream>
#include <cstdlib>
#include <vector>
#include <string>
#include <map>


#define ATRIBUTOS_FILE "AtributosJuego.txt"
#define JUEGO_FILE "Juego.txt"

using namespace std;

struct var{
    int p;
    int n;
    int a;
    int r;

    var(int p, int n, int a, int r) {
        this->p = p;
        this->n = n;
        this->a = a;
        this->r = r;

    }
};

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


void cargarDatos(vector<vector<string>> &v){

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
        while (!fichero.eof()) {
            vector<string> auxVector;
            fichero >> aux;
            auxVector = split(aux, ',');
            v.push_back(auxVector);
        }
        fichero.close();
       
    }

 }

void escribeMatriz(vector<vector<string>> v, int tamaño) {
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

void crearMapaDatos(vector<map<string, var>>& mapas, vector<vector<string>>& datos) {
    cout << ":::::::::::::::::::::::" << "\n";
    
    for (int i = 0; i < datos[0].size(); i++) {
        for (int j = 0; j < datos.size(); j++) {
            auto curr = mapas[j].find(datos[j][i]);
            if (curr == mapas[j].end()) {
                mapas[j].insert(make_pair(datos[j][i], var()));
            }
            cout << datos[j][i];
        }
    }
}

int main(){

    vector<vector<string>> datos;
    cargarDatos(datos);
    escribeMatriz(datos, 20);
    vector<map<string, var>> mapas(datos.size());

    crearMapaDatos(mapas, datos);
    return 0;
 }


