class TranslationService
  def initialize(text:, source_language:)
    @text = text
    @source_language = source_language
  end

  def call
    lang = @source_language == "auto" ? detect_language(@text) : @source_language
    return { translated_text: @text, detected_language: "zh_tw" } if lang == "zh_tw"

    client = Anthropic::Client.new(api_key: ENV.fetch("ANTHROPIC_API_KEY"))
    response = client.messages.create(
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: build_system_prompt(lang),
      messages: [{ role: "user", content: @text }]
    )

    { translated_text: response.content[0].text, detected_language: lang }
  end

  private

  def build_system_prompt(lang)
    case lang
    when "zh_cn"
      "你是繁體中文轉換專家。將簡體中文轉為繁體中文（台灣用語）。同時轉換用詞：" \
        "用户→使用者、信息→資訊、视频→影片、软件→軟體、网络→網路、" \
        "内存→記憶體、硬盘→硬碟、服务器→伺服器。保留品牌名。只輸出結果。"
    when "ja"
      "你是專業翻譯員。將日文產品說明翻譯成繁體中文（台灣用語）。" \
        "保留品牌名，日文名稱保留原文加括號註中文。只輸出翻譯結果。"
    else
      "你是專業翻譯員。將英文產品說明翻譯成繁體中文（台灣用語）。" \
        "保留品牌名。只輸出翻譯結果。"
    end
  end

  def detect_language(text)
    sample = text[0, 600] || text
    return "ja" if sample.scan(/[\u3040-\u309F\u30A0-\u30FF]/).size > 3

    cjk   = sample.scan(/[\u4E00-\u9FFF]/).size
    total = sample.gsub(/\s/, "").size
    return "en" if total.zero? || (cjk.to_f / total) < 0.15

    simp = sample.scan(/[这个们么为对机与关时从过长动万开无专业东让说还进种该着没头发实现问产电网]/).size
    trad = sample.scan(/[這個們麼為對機與關時從過長動萬開無專業東讓說還進種該著沒頭髮實現問產電網]/).size
    if simp > trad + 1
      "zh_cn"
    elsif trad > simp + 1
      "zh_tw"
    else
      simp > 0 ? "zh_cn" : "zh_tw"
    end
  end
end
