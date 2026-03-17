Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    post "ai/translate",      to: "ai#translate"
    post "ai/generate",       to: "ai#generate"

    get  "images/from_path",  to: "images#from_path"
    get  "images/:id",        to: "images#show"
    post "images/from_path",  to: "images#from_path"

    resources :posts, only: %i[index show create update destroy]
  end
end
