import pickle
def recommend_top_6():
    with open('../recommendation_model/recommand_top_6.pkl','rb') as f:
        movie_list=pickle.load(f)  
    print(movie_list())  
recommend_top_6()