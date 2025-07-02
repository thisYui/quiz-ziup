Rails.application.routes.draw do
  namespace :auth do
    post "login",        to: "authentication#login"
    post "register",     to: "authentication#register"
    post "send_otp",     to: "authentication#send_otp"
    post "confirm_otp",  to: "authentication#confirm_otp"
    delete "logout",     to: "authentication#logout"
  end
end
