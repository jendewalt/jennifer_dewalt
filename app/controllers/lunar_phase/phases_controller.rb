class LunarPhase::PhasesController < ApplicationController
  def index
    @title = "Lunar Phase"
    @phase = LunarPhasePhase.first
    now = DateTime.now

    unless @phase 
      w_api = Wunderground.new
      data = w_api.astronomy_for("WA","Spokane")
      @phase = LunarPhasePhase.create(:moon_age => data['moon_phase']['ageOfMoon'], :percent_illuminated => data['moon_phase']['percentIlluminated'])
    end

    if @phase.updated_at < 6.hours.ago
      w_api = Wunderground.new
      data = w_api.astronomy_for("WA","Spokane")
      @phase = LunarPhasePhase.first
      @phase.update_attributes(:moon_age => data['moon_phase']['ageOfMoon'], :percent_illuminated => data['moon_phase']['percentIlluminated'])
    end
  end
end
