Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "localhost:5175", "127.0.0.1:5175"

    resource "/api/*",
      headers: :any,
      methods: %i[get post patch put delete options]
  end
end
