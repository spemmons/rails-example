class Ability
  include CanCan::Ability

  def initialize(user)
    if user.roles?(:admin)
      can :manage,:all
    end

    if user.roles?(:manager)
      can :manage,:user
    end

    can :manage,:jog_time
  end
end
