module Api
  class PostsController < ApplicationController
    def index
      posts = GroupbuyPost.order(created_at: :desc).limit(50)
      render json: posts.as_json(
        only: %i[id product_name group_price status created_at],
        include: { post_images: { only: %i[id filename position image_path path_type] } }
      )
    end

    def show
      post = GroupbuyPost.find(params[:id])
      render json: post.as_json(
        include: { post_images: { only: %i[id filename position image_path path_type] } }
      )
    rescue ActiveRecord::RecordNotFound
      render json: { error: "找不到記錄" }, status: :not_found
    end

    def create
      post = GroupbuyPost.new(post_params)

      if params[:image_paths].present?
        params[:image_paths].each_with_index do |raw_path, idx|
          path_type = detect_path_type(raw_path)
          post.post_images.build(
            filename:   File.basename(raw_path.tr("\\", "/")),
            image_path: raw_path,
            path_type:  path_type,
            position:   idx + 1
          )
        end
      end

      if post.save
        render json: post.as_json(
          include: { post_images: { only: %i[id filename position image_path path_type] } }
        ), status: :created
      else
        render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      post = GroupbuyPost.find(params[:id])
      if post.update(post_params)
        render json: post
      else
        render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
      end
    rescue ActiveRecord::RecordNotFound
      render json: { error: "找不到記錄" }, status: :not_found
    end

    def destroy
      post = GroupbuyPost.find(params[:id])
      post.destroy
      head :no_content
    rescue ActiveRecord::RecordNotFound
      render json: { error: "找不到記錄" }, status: :not_found
    end

    private

    def detect_path_type(path)
      case path.to_s
      when /\A[A-Za-z]:\\/  then "windows"
      when /\A\/mnt\/[a-z]\// then "wsl2"
      else "linux"
      end
    end

    def post_params
      params.permit(
        :product_name, :original_description, :source_language,
        :translated_description, :generated_post, :edited_post,
        :group_price, :start_date, :end_date,
        :order_method, :shipping_json, :status
      )
    end
  end
end
