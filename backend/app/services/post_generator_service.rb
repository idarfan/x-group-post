class PostGeneratorService
  STYLE_PROMPT_PATH = Rails.root.join("groupbuy.md")

  def initialize(translated_description:, image_count:, product_info: {})
    @translated_description = translated_description
    @image_count = image_count
    @product_info = product_info
  end

  def call
    client = Anthropic::Client.new(api_key: ENV.fetch("ANTHROPIC_API_KEY"))
    style_guide = File.read(STYLE_PROMPT_PATH)

    response = client.messages.create(
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system: style_guide,
      messages: [{ role: "user", content: build_user_prompt }]
    )

    response.content[0].text || ""
  end

  private

  def build_user_prompt
    parts = []
    parts << "以下是翻譯後的繁體中文產品說明：\n\n#{@translated_description}"
    parts << "\n\n上傳圖片數量：#{@image_count} 張"

    if @product_info.present?
      parts << "\n\n補充資訊："
      parts << "- 產品名稱：#{@product_info['name']}"         if @product_info["name"].present?
      parts << "- 原價：#{@product_info['original_price']}"    if @product_info["original_price"].present?
      parts << "- 團購價：#{@product_info['group_price']}"     if @product_info["group_price"].present?
      parts << "- 下單方式：#{@product_info['order_method']}"  if @product_info["order_method"].present?

      if @product_info["start_date"].present? || @product_info["end_date"].present?
        parts << "- 團購期間：#{@product_info['start_date'] || '即日起'} ~ #{@product_info['end_date'] || '售完為止'}"
      end

      append_shipping_info(parts, @product_info["shipping"])
    end

    parts << "\n\n請根據以上資訊，依照風格指引撰寫一篇完整團購貼文（付費帳戶，無字數限制，單篇純文字，非推文串）。"
    parts.join
  end

  def append_shipping_info(parts, shipping)
    return if shipping.blank?

    included = []
    excluded = []

    included << "含國際運費"    if shipping["intl_shipping"];  excluded << "國際運費"       unless shipping["intl_shipping"]
    included << "含稅"          if shipping["tax"];            excluded << "稅金"           unless shipping["tax"]
    included << "全家店到店 $60" if shipping["cvs_family"];    excluded << "全家店到店運費"  unless shipping["cvs_family"]
    included << "郵寄 $80 起"   if shipping["postal"];        excluded << "郵寄費用"        unless shipping["postal"]

    parts << "- ✅ 已含：#{included.join('、')}"                                 if included.any?
    parts << "- ⚠️ 不含（務必在貼文中明確註明）：#{excluded.join('、')}"          if excluded.any?
    parts << "- 運費備註：#{shipping['note']}"                                    if shipping["note"].present?
  end
end
