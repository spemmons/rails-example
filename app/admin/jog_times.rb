ActiveAdmin.register JogTime do
  permit_params :user_id, :date, :duration, :distance

  index do
    selectable_column
    id_column
    column :user
    column :date
    column :duration
    column :distance
    column :speed
    actions
  end

  filter :user
  filter :date
  filter :duration
  filter :distance

  form do |f|
    f.inputs 'Details' do
      f.input :user
      f.input :date
      f.input :duration,min: 0
      f.input :distance,min: 0
    end
    f.actions
  end


end
