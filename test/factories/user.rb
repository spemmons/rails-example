FactoryGirl.define do
  factory :user do
    sequence(:email) { |n| "test_user_#{n}@test.com" }
    password 'testing!!'
    provider 'email'
  end
end