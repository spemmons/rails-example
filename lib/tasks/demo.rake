task load_demo_date: :environment do
  lines = File.readlines('runner-data.tsv').collect(&:chomp)

  users = []
  emails_passwords = lines.shift.split("\t")
  (emails_passwords.length / 2).times do |counter|
    email = emails_passwords[counter * 2]
    password = emails_passwords[counter * 2 + 1]
    User.find_by_email(email).destroy rescue nil
    users << User.create!(email: email,password: password)
  end

  date = Time.zone.now.beginning_of_day - lines.length.days
  lines.each do |line|
    tuple = line.split("\t")
    users.each_with_index do |user,offset|
      user.jog_times.create(date: date,duration: tuple[offset * 2].to_i * 60,distance: tuple[offset * 2 + 1])
    end
    date += 1.day
  end

end