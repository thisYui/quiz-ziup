# Load môi trường Rails
require_relative '../config/environment'

a = [
  {
    a: "test",
    b: 123,
    c: [1, 2, 3],
  },
  {
    a: "test2",
    b: 456,
    c: [4, 5, 6],
  }
]

encode = SimpleEncryptor.new.encrypt(a)
puts "Encoded data: #{encode}"

decode = SimpleEncryptor.new.decrypt(encode)
puts "Decoded data: #{decode}"
