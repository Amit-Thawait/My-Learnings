# https://medium.com/basecs/inching-towards-insertion-sort-9799274430da

def insertion_sort(numbers)
  numbers_length = numbers.length

  (1..numbers_length-1).each do |i|
    # p "current_unsorted_item is currently #{numbers[i]}"
    current_unsorted_item = numbers[i]

    j = i
    while(j > 0 && current_unsorted_item < numbers[j-1])
      # p "#{current_unsorted_item} < #{numbers[j-1]} is (#{current_unsorted_item < numbers[j-1]})"
      numbers[j] = numbers[j-1]
      # p "** inserting #{numbers[j-1]} at index #{j}"
      j -= 1
    end

    numbers[j] = current_unsorted_item
    # p "** inserting #{current_unsorted_item} at index #{j}"

    # p "array is now: #{numbers}"
  end

  numbers
end

# Total number of iterations = n(n-1)/2
# Time Complexity  = O(n^2)
# Space Complexity = O(1)

numbers = [4, -31, 0, 99, 83, 1]
insertion_sort(numbers)
