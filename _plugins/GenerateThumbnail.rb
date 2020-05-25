require 'json'
require 'base64'
require 'miro'
require 'image_size'
# require 'chunky_png'

Jekyll::Hooks.register :site, :post_read do |site|
  data_file_path = File.join('.', '_data', 'gallery.json')

  unless File.exist?(data_file_path)
    puts 'Hooks: finding image dominant color..'

    gallery_path = File.join('assets', 'gallery')
    gallery_data = []
    Miro.options[:color_count] = 1

    Dir.children(gallery_path).sort.each do |img|
      puts "\t> processing image: #{img}"

      img_path = File.join('.', gallery_path, img)
      img_base64_prefix = "data:image/png;base64,"
      img_dimensions = ImageSize.path(img_path).size
      img_aspect_ratio = img_dimensions.map { |dimension| dimension / img_dimensions[0].gcd(img_dimensions[1]) }
      img_dominant_color = Miro::DominantColors.new(img_path).to_rgb[0]

      # img_thumbnail = ChunkyPNG::Image.new(img_aspect_ratio[0], img_aspect_ratio[1], ChunkyPNG::Color::TRANSPARENT)
      #
      # (0...img_aspect_ratio[0]).each do |row|
      #   (0...img_aspect_ratio[1]).each do |col|
      #     img_thumbnail[row, col] = ChunkyPNG::Color.rgb(img_dominant_color[0], img_dominant_color[1], img_dominant_color[2])
      #   end
      # end
      #
      # img_base64 = Base64.strict_encode64(img_thumbnail.to_datastream.to_blob)

      gallery_data.push({
                            'name': img,
                            'basename': img.split('.')[0],
                            'path': File.join('', gallery_path, img),
                            'width': img_dimensions[0],
                            'height': img_dimensions[1],
                            'dominant_color': img_dominant_color.join(','),
                            # 'base64': img_base64_prefix + img_base64
                        })
    end

    File.open(data_file_path, 'w') { |f| f.write(gallery_data.to_json) }
  end
end