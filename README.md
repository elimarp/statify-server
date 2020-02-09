# Statify Server - v1
Servidor NodeJS do projeto Statify.

## Statify
Obtenha estatísticas de artistas baseadas em dados do maior serviço de streaming de músicas da atualidade: [Spotify®](https://www.spotify.com/).  
Desculpe-nos. O site ainda não está disponível publicamente.

# API (Tente você mesmo)
Você mesmo pode obter os dados da API da forma que quiser!  
**Base URL:** ``` https://elimarp-statify.herokuapp.com```

## Endpoints

### ARTISTAS:
Adquira informações dos artistas.

#### Objeto:
```
{
  "spotifyId": "53XhwfbYqKCa1cC15pYq2q",
  "name": "Imagine Dragons",
  "popularity": 92,
  "followers": 25175077,
  "genres": [
    "modern rock",
    "rock"
  ],
  "images": [
    {
      "height": 640,
      "url": "https://i.scdn.co/image/01b36ca0f45f2f15117022a2754287a6ca1acdcc",
      "width": 640
    },
    {
      "height": 320,
      "url": "https://i.scdn.co/image/ff8d83627cb2a80d4c1fa36fd80a193ca34b7a50",
      "width": 320
    },
    {
      "height": 160,
      "url": "https://i.scdn.co/image/1cdf5ce3cf329ae433bfa76e88dadeb06653fda9",
      "width": 160
    }
  ]
}
```

### Listagem de Artistas
```/artists``` - Obtenha listas voláteis de artistas.

#### Query Params:
- **```limit``` (*Integer*) :**  
Número máximo de dados retornados pela API. Defina ```0``` para ilimitar a busca. **Valor padrão:** ```50```.

- **```sort``` (*Comma-Separated Values*) :**  
Lista de atributos que, respectivamente, definirão a ordem (decrescente) dos dados.  
  - **Valores válidos:**
    - ```followers```
    - ```popularity```
    - **EM BREVE** ```monthly-listeners```
    
  **Valor padrão:** ```popularity,followers```.
  
 - **```genres``` (*Comma-Separated Values*) :**  
 Filtra os dados para somente artistas que incluem esse(s) gênero(s) musicais.
 
 ### Detalhes do Artista:
 ```/artists/:id``` - Resgatar informações de um determinado artista através de seu ID no Spotify.
 
 **NOTA:** O ID de um artista pode ser encontrado através da interface [Open Spotify](https://open.spotify.com/), acessando o perfil do artista.
 ![Spotify ID demo](https://i.ibb.co/k5Rcryg/Screenshot-1.jpg)
 
 #### Params:
 - **```id``` (*String*) :**  
ID do artista no Spotify.
