module Api
  class AiController < ApplicationController
    def translate
      service = TranslationService.new(
        text: params.require(:text),
        source_language: params[:source_language] || "auto"
      )
      result = service.call

      render json: {
        translated_text: result[:translated_text],
        detected_language: result[:detected_language]
      }
    rescue KeyError => e
      render json: { error: e.message }, status: :bad_request
    rescue => e
      render json: { error: e.message }, status: :unprocessable_entity
    end

    def generate
      service = PostGeneratorService.new(
        translated_description: params.require(:translated_description),
        image_count: params[:image_count].to_i,
        product_info: params[:product_info]&.to_unsafe_h || {}
      )

      render json: { post: service.call }
    rescue KeyError => e
      render json: { error: e.message }, status: :bad_request
    rescue => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end
end
