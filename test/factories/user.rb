FactoryGirl.define do
  factory :user do
    sequence(:email) { |n| "test_user_#{n}@test.com" }
    password 'testing!!'
    provider 'email'

    factory :manager_user do
      roles [:manager]
    end

    factory :admin_user do
      roles [:admin]
    end
  end
end