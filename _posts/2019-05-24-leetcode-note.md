---
layout: note
title: LeetCode Note
date: 2019-05-24 23:45 -0400
author: Chauncy
category: blog
tags: [algorithm, note]
published: true
excerpt_separator: <!--more-->
---

<!--more-->

# Leetcode Note


## String

### Longest Substring Without Repeating Characters - 3
Medium
{:.badge.m}
Substring
{:.badge}
#### Problem
```text
Given a string, find the length of the longest substring without repeating characters.

Example 1:
Input: "abcabcbb"
Output: 3 
Explanation: The answer is "abc", with the length of 3. 

Example 2:
Input: "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Example 3:
Input: "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3. 
             Note that the answer must be a substring, "pwke" is a subsequence and not a substring.
```
#### Solution
Basic idea, use `sliding window` to slide through the whole string.   
Used a low pointer to log where current window starts, and use a map to log where each letters appeared fot the last time.  

**Caution**: when resetting the low pointer, we should take the max of `lo` and `dic[c] + 1`.  
E.g.`abcaab`, when the window slides to the last b, low pointer is at a with index of -2 and current window is `a`, but the former b with index of 1 is still in the hashmap. If we use `dic[c] + 1` at this point, the window will become `caab` instead of `ab`.
```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        res = 0
        lo = 0
        dic = {}
        for i, c in enumerate(s):
            if c in dic:
                lo = max(lo, dic[c] + 1)  # caution: abcaab
            dic[c] = i
            res = max(i - lo + 1, res)
        return res
```

### Longest Palindromic Substring - 5
Medium
{:.badge.m}
Palindrome
{:.badge}
#### Problem
```text
Given a string s, find the longest palindromic substring in s. You may assume that the maximum length of s is 1000.

Example 1:
Input: "babad"
Output: "bab"
Note: "aba" is also a valid answer.

Example 2:
Input: "cbbd"
Output: "bb"
```
#### Solution
Since a palindrome mirrors around its center, and there are totally `2n - 1` such centers, we could expand around these centers to find the longest palindrome. `Time complexity: O(n^2)`  

**Note**: use `//` in python for floor division.
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        start, end = 0, 0
        for i in range(len(s)):
            cur_len = max(self.expand(s, i, i), self.expand(s, i, i + 1))
            if cur_len > end - start:
                start = i - (cur_len - 1) // 2  # trick here, remember to -1 since it could expand at center of two char
                end = i + cur_len // 2
        return s[start:end + 1]

    def expand(self, s, left, right):
        l, r = left, right
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return r - l - 1
```
`TODO: DP, Manacher's Algorithm`

### Reverse Integer - 7
Easy
{:.badge.e}
#### Problem
```text
Given a 32-bit signed integer, reverse digits of an integer.

Example 1:
Input: 123
Output: 321

Example 2:
Input: -123
Output: -321

Example 3:
Input: 120
Output: 21

Note:
Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [−231,  231 − 1]. For the purpose of this problem, assume that your function returns 0 when the reversed integer overflows.
```
#### Solution
The most challenge part in this problem is not letting the result overflow, so the result has to be checked each time during calculation.
```java
class Solution {
    public int reverse(int x) {
        int result = 0;
        while (x != 0) {
            int tail = x % 10;
            x /= 10;
            if (result > Integer.MAX_VALUE / 10 || result == Integer.MAX_VALUE / 10 && tail > 7) return 0;
            if (result < Integer.MIN_VALUE / 10 || result == Integer.MIN_VALUE / 10 && tail < -8) return 0;
            result = result * 10 + tail;
        }
        return result;
    }
}
```
Another brilliant solution from discussion.  
I'm not sure if it's a good solution, because the integer could overflow during calculation (even though it is the intention).   
During calculation, the temp result is `result * 10 + tail`, but if it's smaller than `-2^31`or larger than `2^31 - 1`, it will overflow and return a number that is not correct.
```java
class Solution {
    public int reverse(int x) {
        int result = 0;
        while (x != 0) {
            int tail = x % 10;
            // overflow here, brilliant here
            if (((result * 10 + tail) - tail) / 10 != result) return 0;
            result = result * 10 + tail;
            x /= 10;
        }
        return result;
    }
}
```

### String to Integer (atoi) - 8 
Easy
{:.badge.e}
#### Problem
```text
Implement atoi which converts a string to an integer.

The function first discards as many whitespace characters as necessary until
the first non-whitespace character is found. Then, starting from this
character, takes an optional initial plus or minus sign followed by as many
numerical digits as possible, and interprets them as a numerical value.

The string can contain additional characters after those that form the
integral number, which are ignored and have no effect on the behavior of
this function.

If the first sequence of non-whitespace characters in str is not a valid
integral number, or if no such sequence exists because either str is empty
or it contains only whitespace characters, no conversion is performed.

If no valid conversion could be performed, a zero value is returned.

Note:
Only the space character ' ' is considered as whitespace character.
Assume we are dealing with an environment which could only store integers
within the 32-bit signed integer range: [−2^31,  2^31 − 1]. If the numerical
value is out of the range of representable values, INT_MAX (2^31 − 1) or
INT_MIN (−2^31) is returned.

Example 1:
Input: "42"
Output: 42

Example 2:
Input: "   -42"
Output: -42
Explanation: The first non-whitespace character is '-', which is the minus
sign.
Then take as many numerical digits as possible, which gets 42.

Example 3:
Input: "4193 with words"
Output: 4193
Explanation: Conversion stops at digit '3' as the next character is not a
numerical digit.

Example 4:
Input: "words and 987"
Output: 0
Explanation: The first non-whitespace character is 'w', which is not a
numerical 
digit or a +/- sign. Therefore no valid conversion could be performed.

Example 5:
Input: "-91283472332"
Output: -2147483648
Explanation: The number "-91283472332" is out of the range of a 32-bit
signed integer.
Thefore INT_MIN (−2^31) is returned.
```
#### Solution
```java
class Solution {
    public int myAtoi(String str) {
        int res = 0;
        int sign = 1;
        int i = 0;
        
        while (i < str.length() && str.charAt(i) == ' ') i++;
        if (i == str.length()) return 0;
        
        if (str.charAt(i) == '-' || str.charAt(i) == '+') {
            if (str.charAt(i) == '-') sign = -1;
            i++;
        } else if (str.charAt(i) - '0' < 0 || str.charAt(i) - '0' > 9) {
            return 0;
        } 
            
        while (i < str.length() && str.charAt(i) - '0' >= 0 && str.charAt(i) - '0' <= 9) {
            int digit = str.charAt(i) - '0';
            if (sign > 0 && (res > Integer.MAX_VALUE / 10 || res == Integer.MAX_VALUE / 10 && digit > Integer.MAX_VALUE % 10)) return Integer.MAX_VALUE;
            if (sign < 0 && (-res < Integer.MIN_VALUE / 10 || -res == Integer.MIN_VALUE / 10 && -digit < Integer.MIN_VALUE % 10)) return Integer.MIN_VALUE;
            res = res * 10 + digit;
            i++;
        }
        
        return res * sign;
    }
}
```

### Palindrome Number - 9
Easy
{:.badge.e}
Palindrome
{:.badge}
#### Problem
```text
Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.

Example 1:

Input: 121
Output: true
Example 2:

Input: -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
Example 3:

Input: 10
Output: false
Explanation: Reads 01 from right to left. Therefore it is not a palindrome.
Follow up:

Coud you solve it without converting the integer to a string?
```
#### Solution
My first thought, instead of convert it into string, it's to compare the first and last digit continuously.  
The problem is, how could I know I've compared half of the digits?  
Thanks to the official solution, they have a very similar approach by reverse the left half of the number, and when the right half is no longer larger than the right half, we know it is the end.
```java
class Solution {
    public boolean isPalindrome(int x) {
        // take care of edge cases        
        if (x < 0 || x % 10 == 0 && x != 0) return false;
        int left = x;
        int right = 0;
        // = only in case of x = 0
        while (left >= right) {
            right = right * 10 + left % 10;
            left /= 10;
            if (right == left || right / 10 == left) return true;
        }
        return false;
    }
}
```

### Valid Parentheses - 20 
Easy
{:.badge.e}
Stack
{:.badge}
#### Problem
```text
Given a string containing just the characters '(', ')', '{', '}', 
'[' and ']', determine if the input string is valid.

An input string is valid if:
Open brackets must be closed by the same type of brackets.
Open brackets must be closed in the correct order.

Note that an empty string is also considered valid.

Example 1:
Input: "()"
Output: true

Example 2:
Input: "()[]{}"
Output: true

Example 3:
Input: "(]"
Output: false

Example 4:
Input: "([)]"
Output: false

Example 5:
Input: "{[]}"
Output: true
```
#### Solution
```java
public class Solution {
    public boolean isValid(String s) {
        Map<Character, Character> map = new HashMap<>();
        map.put('(', ')');
        map.put('{', '}');
        map.put('[', ']');
        Stack<Character> stack = new Stack<>();
        for (int i = 0; i < s.length(); i++) {
            char cur = s.charAt(i);
            if (map.containsKey(cur)) {
                stack.push(cur);
            } else if (stack.isEmpty() || map.get(stack.pop()) != cur) { 
                return false;
            }
        }
        return stack.isEmpty();
    }
}
```

### Group Anagrams - 49
Medium
{:.badge.m}
#### Problem
```text
Given an array of strings, group anagrams together.

Example:
Input: ["eat", "tea", "tan", "ate", "nat", "bat"],
Output:
[
⁠ ["ate","eat","tea"],
⁠ ["nat","tan"],
⁠ ["bat"]
]

Note:
All inputs will be in lowercase.
The order of your output does not matter.
```
#### Solution
```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        List<List<String>> res = new ArrayList<>();
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] cur = s.toCharArray();
            Arrays.sort(cur);
            String key = Arrays.toString(cur);
            List<String> list = map.getOrDefault(key, new ArrayList<>());
            list.add(s);
            map.put(key, list);
        }
        return new ArrayList(map.values());  // <--
    }
}
```

### Basic Calculator - 224
Hard
{:.badge.h}
#### Problem
```text
Implement a basic calculator to evaluate a simple expression string.

The expression string may contain open ( and closing parentheses ), the plus
+ or minus sign -, non-negative integers and empty spaces  .

Example 1:
Input: "1 + 1"
Output: 2

Example 2:
Input: " 2-1 + 2 "
Output: 3

Example 3:
Input: "(1+(4+5+2)-3)+(6+8)"
Output: 23
Note:

You may assume that the given expression is always valid.
Do not use the eval built-in library function.
```
#### Solution
```java
class Solution {
    public int calculate(String s) {
        int res = 0;
        int cur = 0;
        int sign = 1;
        Stack<Integer> stack = new Stack<>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == ' ') continue;
            if (c >= '0' && c <= '9') {
                cur = cur * 10 + c - '0';
            } else if (c == '+' || c == '-') {
                res += cur * sign;
                cur = 0;
                sign = c == '+' ? 1 : -1;
            } else if (c == '(') {
                stack.push(res);
                stack.push(sign);
                res = 0;
                // cur = 0;  // cur already marked as 0 before (
                sign = 1;
            } else if (c == ')') {
                res += cur * sign;
                res = res * stack.pop() + stack.pop();
                cur = 0;
                // sign = 1;  // next char will be sign
            }
        }
        if (cur != 0) res += cur * sign;
        return res;
    }
}
```

### Backspace String Compare - 844
Easy
{:.badge.e}
Two Pointer
{:.badge}
#### Problem
```text
Given two strings S and T, return if they are equal when both are typed into
empty text editors. # means a backspace character.

Example 1:
Input: S = "ab#c", T = "ad#c"
Output: true
Explanation: Both S and T become "ac".

Example 2:
Input: S = "ab##", T = "c#d#"
Output: true
Explanation: Both S and T become "".

Example 3:
Input: S = "a##c", T = "#a#c"
Output: true
Explanation: Both S and T become "c".

Example 4:
Input: S = "a#c", T = "b"
Output: false
Explanation: S becomes "c" while T becomes "b".

Note:
1 <= S.length <= 200
1 <= T.length <= 200
S and T only contain lowercase letters and '#' characters.

Follow up:
Can you solve it in O(N) time and O(1) space?
```
#### Solution
```java
class Solution {
    public boolean backspaceCompare(String S, String T) {
        int i = S.length() - 1, j = T.length() - 1;
        while (i >= 0 || j >= 0) {
            int back = 0;
            while (i >= 0 && (S.charAt(i) == '#' || back > 0)) {
                back += S.charAt(i) == '#' ? 1 : -1;
                i--;
            }

            back = 0;
            while (j >= 0 && (T.charAt(j) == '#' || back > 0)) {
                back += T.charAt(j) == '#' ? 1 : -1;
                j--;
            }
 
            if (i >= 0 && j >= 0 && S.charAt(i) == T.charAt(j)) {
                i--;
                j--;
            } else {
                break;
            }
        }
        return i == -1 && j == -1;
    }
}
```


## Array

### Two Sum - 1
Easy
{:.badge.e}
N Sum
{:.badge}
#### Problem
```text
Given an array of integers, return indices of the two numbers such that they
add up to a specific target.

You may assume that each input would have exactly one solution, and you may
not use the same element twice.

Example:
Given nums = [2, 7, 11, 15], target = 9,
Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].
```
#### Solution
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int req = target - nums[i];
            if (map.containsKey(req)) {
                return new int[] {map.get(req), i};
            }   
            else {
                map.put(nums[i], i);
            }
        }
        return new int[]{};
    }
}
```

### Three Sum - 15
Medium
{:.badge.m}
N Sum
{:.badge}
#### Problem
```text
 Given an array nums of n integers, are there elements a, b, c in nums such
 that a + b + c = 0? Find all unique triplets in the array which gives the
 sum of zero.
 
 Note:
 The solution set must not contain duplicate triplets.
 
 Example:
 Given array nums = [-1, 0, 1, 2, -1, -4],
 
 A solution set is:
 [
 ⁠ [-1, 0, 1],
 ⁠ [-1, -1, 2]
 ]
```
#### Solution
A very classical problem.  
Basic idea is to sort the array and using `two pointer` to find the complementary two sum.  
```java
public class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);
        for (int i = 0; i < nums.length; i++) {
            if (i == 0 || nums[i] != nums[i - 1]) {
                int lo = i + 1, hi = nums.length - 1;
                // dont need to check the length of input array, if its length < 3, lo < hi will not stand
                while (lo < hi) {
                    int sum = nums[i] + nums[lo] + nums[hi];
                    if (sum == 0) {
                        // hey!
                        res.add(Arrays.asList(nums[i], nums[lo], nums[hi]));
                        while (lo < hi && nums[lo] == nums[lo + 1]) lo++;
                        while (lo < hi && nums[hi] == nums[hi - 1]) hi--;
                        lo++;
                        hi--;
                    } else if (sum < 0) {
                        lo++;
                    } else {
                        hi--;
                    }
                }
            }
        }
        return res;
    }
}
```

### Majority Element - 169
Easy
{:.badge.e}
#### Problem
```
Given an array of size n, find the majority element. The majority element is
the element that appears more than ⌊ n/2 ⌋ times.

You may assume that the array is non-empty and the majority element always
exist in the array.

Example 1:
Input: [3,2,3]
Output: 3

Example 2:
Input: [2,2,1,1,1,2,2]
Output: 2
```
#### Solution
```java
class Solution {
    public int majorityElement(int[] nums) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i : nums) {
            int count = map.getOrDefault(i, 0);
            if (count + 1 > nums.length / 2) return i;
            map.put(i, count + 1);
        }
        return -1;
    }
}
```
[Boyer-Moore Voting Algorithm](http://www.cs.utexas.edu/~moore/best-ideas/mjrty/index.html)
```java
class Solution {
    public int majorityElement(int[] nums) {
        int count = 0;
        Integer candidate = null;

        for (int num : nums) {
            if (count == 0) {
                candidate = num;
            }
            count += (num == candidate) ? 1 : -1;
        }

        return candidate;
    }
}
```

### Binary Search - 704
Easy
{:.badge.e}
Binary Search
{:.badge}
#### Problem
```
Given a sorted (in ascending order) integer array nums of n elements and a
target value, write a function to search target in nums. If target exists,
then return its index, otherwise return -1.

Example 1:
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4

Example 2:
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1

Note:
You may assume that all elements in nums are unique.
n will be in the range [1, 10000].
The value of each element in nums will be in the range [-9999, 9999].
```
#### Solution
```
What is log2(8) mean?
It means that, my base is 2, what should I power 2 by, to get 8?
The answer is 3 = log2(8)

log2(8) => 2^3 = 8
log10(100) => 10^2 = 100

8 -> 4 -> 2 -> 1
```
Why is the complexity log(n)?  
Assume there are n elements in total, each time we cut the array in half.  
How many times in total do we need to cut the array?  
So we need to know, what should I power 2 by, to get n. The answer is `log(n)`
```java
class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}
```
Recursively
```java
class Solution {
    public int search(int[] nums, int target) {
        return binarySearch(nums, target, 0, nums.length - 1);
    }
    
    public int binarySearch(int[] nums, int target, int lo, int hi) {
        if (lo > hi) return -1;
        
        int mid = (lo + hi) / 2;
        if (nums[mid] == target) return mid;
        
        if (nums[mid] < target) {
            return binarySearch(nums, target, mid + 1, hi);
        } else {
            return binarySearch(nums, target, lo, mid - 1);
        }
    }
}
```

### Search in Rotated Sorted Array - 33
Medium
{:.badge.m}
Binary Search
{:.badge}
#### Problem
```
Suppose an array sorted in ascending order is rotated at some pivot unknown
to you beforehand.

(i.e., [0,1,2,4,5,6,7] might become [4,5,6,7,0,1,2]).

You are given a target value to search. If found in the array return its
index, otherwise return -1.

You may assume no duplicate exists in the array.

Your algorithm's runtime complexity must be in the order of O(log n).

Example 1:
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4

Example 2:
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
```
#### Solution
```java
class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;  // prevent overflow if lo + hi is too big
            if (nums[mid] == target) return mid;
            
            if (nums[lo] <= nums[mid]) { // left is sorted
                if (target < nums[mid] && target >= nums[lo]) {
                    hi = mid - 1;
                } else {
                    lo = mid + 1;
                }
            } else { // right is sorted
                if (target > nums[mid] && target <= nums[hi]) {
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
        }
        return -1;
    }
}
```

### Rotate Array - 189
Easy
{:.badge.e}
Geometry
{:.badge}
#### Problem
```
Given an array, rotate the array to the right by k steps, where k is
non-negative.

Example 1:
Input: [1,2,3,4,5,6,7] and k = 3
Output: [5,6,7,1,2,3,4]
Explanation:
rotate 1 steps to the right: [7,1,2,3,4,5,6]
rotate 2 steps to the right: [6,7,1,2,3,4,5]
rotate 3 steps to the right: [5,6,7,1,2,3,4]

Example 2:
Input: [-1,-100,3,99] and k = 2
Output: [3,99,-1,-100]
Explanation: 
rotate 1 steps to the right: [99,-1,-100,3]
rotate 2 steps to the right: [3,99,-1,-100]

Note:
Try to come up as many solutions as you can, there are at least 3 different
ways to solve this problem.
Could you do it in-place with O(1) extra space?
```
#### Solution
Naive O(n) space solution
```java
class Solution {
    public void rotate(int[] nums, int k) {
        int[] tmp = new int[nums.length];
        for (int i = 0; i < nums.length; i++) {
            tmp[(i + k) % nums.length] = nums[i];
        }
        for (int i = 0; i < nums.length; i++) {
            nums[i] = tmp[i];
        }
    }
}
```
Genius O(1) sapce solution
```
nums = "----->-->"  // k = 3  
result = "-->----->"  

reverse "----->-->" we can get "<--<-----"  
reverse "<--" we can get "--><-----"  
reverse "<-----" we can get "-->----->"  
```
```java
class Solution {
    public void rotate(int[] nums, int k) {
        k %= nums.length;
        reverse(nums, 0, nums.length - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, nums.length - 1);
    }
    
    public void reverse(int[] arr, int i, int j) {
        while (i < j) {
            int tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
            i++;
            j--;
        }
    }
}
```

### Product of Array Except Self - 238
Medium
{:.badge.m}
Prefix Sum
{:.badge}
#### Problem
```
Given an array nums of n integers where n > 1,  return an array output such
that output[i] is equal to the product of all the elements of nums except
nums[i].

Example:
Input:  [1,2,3,4]
Output: [24,12,8,6]

Note: Please solve it without division and in O(n).

Follow up:
Could you solve it with constant space complexity? (The output array does
not count as extra space for the purpose of space complexity analysis.)
```
#### Solution
Prefix product with extra space
```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        if (nums.length <= 1) return nums;
        
        int[] preLeft = new int[nums.length];        
        preLeft[0] = 1;
        for (int i = 1; i < nums.length; i++) {
            preLeft[i] = preLeft[i - 1] * nums[i - 1];
        }
        
        int[] preRight = new int[nums.length];
        preRight[nums.length - 1] = 1;
        for (int i = nums.length - 2; i >= 0; i--) {
            preRight[i] = preRight[i + 1] * nums[i + 1];
        }
        
        int[] res = new int[nums.length];
        for (int i = 0; i < nums.length; i++) {
            res[i] = preLeft[i] * preRight[i];
        }
        
        return res;
    }
}
```
So-called O(1) solution, calc the prefix right on the fly
```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        if (nums.length <= 1) return nums;
        
        int[] res = new int[nums.length];
        res[0] = 1;
        for (int i = 1; i < nums.length; i++) {
            res[i] = res[i - 1] * nums[i - 1];
        }
        
        int right = 1;
        for (int i = nums.length - 1; i >= 0; i--) {
            res[i] *= right;
            right *= nums[i];
        }
        
        return res;
    }
}
```
Bonus, real O(1) space w/ division
```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int prod = 1;
        int zero = 0;
        for (int i : nums) {
            if (i != 0) prod *= i;
            else zero++;
        }
        for (int i = 0; i < nums.length; i++) {
            if (zero == 0) {
                nums[i] = prod / nums[i];
            } else if (zero == 1 && nums[i] == 0) {  // this is that zero
                nums[i] = prod;
            } else {  // if more than one zero, then prod except itself will always be 0
                nums[i] = 0;
            }
        }
        return nums;
    }
}
```

### Contiguous Array - 525
Medium
{:.badge.m}
Prefix Sum
{:.badge}
#### Problem
```
Given a binary array, find the maximum length of a contiguous subarray with
equal number of 0 and 1. 

Example 1:
Input: [0,1]
Output: 2
Explanation: [0, 1] is the longest contiguous subarray with equal number of
0 and 1.

Example 2:
Input: [0,1,0]
Output: 2
Explanation: [0, 1] (or [1, 0]) is a longest contiguous subarray with equal
number of 0 and 1.

Note:
The length of the given binary array will not exceed 50,000.
```
#### Solution
sum++ when meet 1, sum-- when meet 0  
if two index have same sum, the number of 0 and 1 between these two index must be equal  

consider [0, 0, 0, 1, 1, 0], prefix sum = [-1, -2, -3, -2, -1, -2]  
longest length is between two -1, length = 4 - 0 = 4
```java
class Solution {
    public int findMaxLength(int[] nums) {
        int res = 0;
        int sum = 0;
        Map<Integer, Integer> map = new HashMap<>();
        map.put(0, -1);
        
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == 0) {
                sum--;
            } else {
                sum++;
            }
            if (map.containsKey(sum)) {
                res = Math.max(res, i - map.get(sum));
            } else {
                map.put(sum, i);
            }
        }
        return res;
    }
}
```

### Subarray Sum Equals K - 560
Medium
{:.badge.m}
Prefix Sum
{:.badge}
N Sum
{:.badge}
#### Problem
```
Given an array of integers and an integer k, you need to find the total
number of continuous subarrays whose sum equals to k.

Example 1:
Input:nums = [1,1,1], k = 2
Output: 2

Note:
The length of the array is in range [1, 20,000].
The range of numbers in the array is [-1000, 1000] and the range of the
integer k is [-1e7, 1e7].
```
#### Solution
When subarray occured, we can think about prefix sum `sum(0, i)`  
Find out that `k = sum(0, j) - sum(0, i)`, isn't this familiar? It's two sum!  
We can solve this problem with prefix sum + two sum  
```java
class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();  // prefix sum -> freq
        map.put(0, 1);  // handle nums[i] == k
        int sum = 0;
        int res = 0;
        
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];  // prefix sum
            
            if (map.containsKey(sum - k)) {  // two sum
                res += map.get(sum - k);
            }
            
            map.put(sum, map.getOrDefault(sum, 0) + 1);  // update prefix sum later, in case k = 0 (don't want to count sum itself)
        }
    
        return res;
    }
}
```

### Intersection of Two Arrays - 349
Easy
{:.badge.e}
Intersect
{:.badge}
Two Pointer
{:.badge}
#### Problem
```
Given two arrays, write a function to compute their intersection.

Example 1:
Input: nums1 = [1,2,2,1], nums2 = [2,2]
Output: [2]

Example 2:
Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
Output: [9,4]

Note:
Each element in the result must be unique.
The result can be in any order.
```
#### Solution
```java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> set = new HashSet<>();
        for (int i : nums1) {
            set.add(i);
        }

        int[] res = new int[set.size()];
        int idx = 0;
        for (int i : nums2) {
            if (set.contains(i)) {
                res[idx++] = i;
                set.remove(i);
            }
        }
        
        return Arrays.copyOf(res, idx);
    }
}
```

### Intersection of Two Arrays II - 350
Easy
{:.badge.e}
Intersect
{:.badge}
Two Pointer
{:.badge}
#### Problem
```
Given two arrays, write a function to compute their intersection.

Example 1:
Input: nums1 = [1,2,2,1], nums2 = [2,2]
Output: [2,2]

Example 2:
Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
Output: [4,9]

Note:
Each element in the result should appear as many times as it shows in both
arrays.
The result can be in any order.

Follow up:
What if the given array is already sorted? How would you optimize your
algorithm?
What if nums1's size is small compared to nums2's size? Which algorithm is
better?
What if elements of nums2 are stored on disk, and the memory is limited such
that you cannot load all elements into the memory at once?
```
#### Solution
```java
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i : nums1) {
            map.put(i, map.getOrDefault(i, 0) + 1);
        }

        List<Integer> list = new ArrayList<>();
        for (int i : nums2) {
            if (map.getOrDefault(i, 0) > 0) {
                list.add(i);
                map.put(i, map.get(i) - 1);
            }
        }

        int[] res = new int[list.size()];
        for (int i = 0; i < list.size(); i++) {
            res[i] = list.get(i);
        }
        return res;
    }
}
```
If sorted
```java
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        Arrays.sort(nums1);
        Arrays.sort(nums2);
        
        List<Integer> list = new ArrayList<>();
        int i1 = 0, i2 = 0;
        while (i1 < nums1.length && i2 < nums2.length) {
            if (nums1[i1] == nums2[i2]) {
                list.add(nums1[i1]);
                i1++;
                i2++;
            } else if (nums1[i1] < nums2[i2]) {
                i1++;
            } else {
                i2++;
            }
        }
        
        int[] res = new int[list.size()];
        for (int i = 0; i < list.size(); i++) {
            res[i] = list.get(i);
        }
        return res;
    }
}
```

### Intersection of Three Sorted Arrays - 1213
Easy
{:.badge.e}
Intersect
{:.badge}
Two Pointer
{:.badge}
#### Problem
```
Given three integer arrays arr1, arr2 and arr3 sorted in strictly 
increasing order, return a sorted array of only the integers that 
appeared in all three arrays.

Example 1:

Input: arr1 = [1,2,3,4,5], arr2 = [1,2,5,7,9], arr3 = [1,3,4,5,8]
Output: [1,5]
Explanation: Only 1 and 5 appeared in the three arrays.

Constraints:

1 <= arr1.length, arr2.length, arr3.length <= 1000
1 <= arr1[i], arr2[i], arr3[i] <= 2000
```
#### Solution
```java
class Solution {
    public List<Integer> arraysIntersection(int[] arr1, int[] arr2, int[] arr3) {
        List<Integer> res = new LinkedList<>();
        
        int idx1 = 0, idx2 = 0, idx3 = 0;
        while (idx1 < arr1.length && idx2 < arr2.length && idx3 < arr3.length) {
            if (arr1[idx1] == arr2[idx2] && arr1[idx1] == arr3[idx3]) {
                res.add(arr1[idx1]);
                while (idx1 + 1 < arr1.length && arr1[idx1] == arr1[idx1 + 1]) idx1++;
                while (idx2 + 1 < arr2.length && arr2[idx2] == arr2[idx2 + 1]) idx2++;
                while (idx3 + 1 < arr3.length && arr3[idx3] == arr3[idx3 + 1]) idx3++;
                idx1++;
                idx2++;
                idx3++;
            } else {
                if (arr1[idx1] == arr2[idx2]) {
                    if (arr1[idx1] > arr3[idx3]) idx3++;
                    else {
                        idx1++;
                        idx2++;
                    }
                } else if (arr1[idx1] < arr2[idx2]) {
                    idx1++;
                    if (arr3[idx3] < arr2[idx2]) idx3++;
                } else {
                    idx2++;
                    if (arr3[idx3] < arr1[idx1]) idx3++;
                }
            }
        }
        
        return res;
    }
}
```

### Shuffle an Array - 384
Medium
{:.badge.m}
Random
{:.badge}
#### Problem
```
Shuffle a set of numbers without duplicates.

Example:

// Init an array with set 1, 2, and 3.
int[] nums = {1,2,3};
Solution solution = new Solution(nums);

// Shuffle the array [1,2,3] and return its result. Any permutation of
[1,2,3] must equally likely to be returned.
solution.shuffle();

// Resets the array back to its original configuration [1,2,3].
solution.reset();

// Returns the random shuffling of array [1,2,3].
solution.shuffle();
```
#### Solution
Simple solution is to copy all elements into an arraylist, each time remove a random element from the arraylist, and add it to the output array.  
We can prove that the overally possibility of an element to be picked at each point is equal.  (just like the order of lottery drawing doesn't matter)  
Due of the shift of arraylist, overally complexity will be O(n2)
```java
/**
 * Your Solution object will be instantiated and called as such:
 * Solution obj = new Solution(nums);
 * int[] param_1 = obj.reset();
 * int[] param_2 = obj.shuffle();
 */
class Solution {
    private Random random = new Random();
    private int[] original;
    private int[] nums;
    
    public Solution(int[] nums) {
        this.original = nums.clone();
        this.nums = nums;
    }
    
    /** Resets the array to its original configuration and return it. */
    public int[] reset() {
        nums = original.clone();
        return nums;
    }
    
    /** Returns a random shuffling of the array. */
    public int[] shuffle() {
        List<Integer> list = getArrayCopy();

        for (int i = 0; i < nums.length; i++) {
            int idx = random.nextInt(list.size());
            nums[i] = list.get(idx);
            list.remove(idx);
        }

        return nums;
    }
    
    private List<Integer> getArrayCopy() {
        List<Integer> list = new ArrayList<>();
        for (int i : nums) {
            list.add(i);
        }
        return list;
    }
}
```
`Fisher-Yates Algorithm`  
Similar idea, instead of pick number from another list, during the iteration, pick number from itself, and swap it with current idx. Complexity O(n)
```java
class Solution {
    private Random random = new Random();
    private int[] original;
    private int[] nums;
    
    public Solution(int[] nums) {
        this.original = nums.clone();
        this.nums = nums;
    }
    
    /** Resets the array to its original configuration and return it. */
    public int[] reset() {
        nums = original.clone();
        return nums;
    }
    
    /** Returns a random shuffling of the array. */
    public int[] shuffle() {
        for (int i = 0; i < nums.length; i++) {
            swap(nums, i, i + random.nextInt(nums.length - i));
        }
        return nums;
    }
    
    private void swap(int[] arr, int i, int j) {
        int tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
}
```

### Best Time to Buy and Sell Stock - 121
Easy
{:.badge.e}
Sell Stock
{:.badge}
#### Problem
```text
Say you have an array for which the i^th element is the price of a given
stock on day i.

If you were only permitted to complete at most one transaction (i.e., buy
one and sell one share of the stock), design an algorithm to find the
maximum profit.

Note that you cannot sell a stock before you buy one.

Example 1:
Input: [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit
= 6-1 = 5.
Not 7-1 = 6, as selling price needs to be larger than buying price.

Example 2:
Input: [7,6,4,3,1]
Output: 0
Explanation: In this case, no transaction is done, i.e. max profit = 0.
```
#### Solution
```java
class Solution {
    public int maxProfit(int[] prices) {
        int res = 0;
        Integer min = null;
        for (int i : prices) {
            if (min == null || i < min) min = i;
            res = Math.max(res, i - min);
        }
        return res;
    }
}
```

### Best Time to Buy and Sell Stock II - 122
Easy
{:.badge.e}
Sell Stock
{:.badge}
#### Problem
```text
Say you have an array for which the i^th element is the price of a given
stock on day i.

Design an algorithm to find the maximum profit. You may complete as many
transactions as you like (i.e., buy one and sell one share of the stock
multiple times).

Note: You may not engage in multiple transactions at the same time (i.e.,
you must sell the stock before you buy again).

Example 1:
Input: [7,1,5,3,6,4]
Output: 7
Explanation: Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit
= 5-1 = 4.
Then buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 =
3.

Example 2:
Input: [1,2,3,4,5]
Output: 4
Explanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit
= 5-1 = 4.
Note that you cannot buy on day 1, buy on day 2 and sell them later, as you
are
engaging multiple transactions at the same time. You must sell before buying
again.

Example 3:
Input: [7,6,4,3,1]
Output: 0
Explanation: In this case, no transaction is done, i.e. max profit = 0.
```
#### Solution
Imagine peak and valley, valley is the point to buy, and peak is the point to sell.
```java
class Solution {
    public int maxProfit(int[] prices) {
        int res = 0;
        int valley = 0;
        int peak = 0;
        for (int i = 0; i < prices.length; i++) {
            while (i < prices.length - 1 && prices[i] >= prices[i + 1]) i++;
            valley = prices[i];
            while (i < prices.length - 1 && prices[i] <= prices[i + 1]) i++;
            peak = prices[i];
            res += peak - valley;
        }
        return res;
    }
}
```
Actually we don't even need to keep track of the peak & valley.
```java
class Solution {
    public int maxProfit(int[] prices) {
        int res = 0;
        for (int i = 0; i < prices.length - 1; i++) {
            if (prices[i + 1] > prices[i]) {
                res += prices[i + 1] - prices[i];
            }
        }
        return res;
    }
}
```

## LinkedList

### Add Two Numbers - 2
Medium
{:.badge.m}
#### Problem
```text
You are given two non-empty linked lists representing two non-negative
integers. The digits are stored in reverse order and each of their nodes
contain a single digit. Add the two numbers and return it as a linked list.

You may assume the two numbers do not contain any leading zero, except the
number 0 itself.

Example:
Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
Output: 7 -> 0 -> 8
Explanation: 342 + 465 = 807.
```
#### Solution
``` java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
 
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode res = new ListNode(0);
        ListNode cur = res, cur1 = l1, cur2 = l2;
        int payload = 0;
        while (cur1 != null || cur2 != null) {
            int sum = payload;
            if (cur1 != null) {
                sum += cur1.val;
                cur1 = cur1.next;
            }
            if (cur2 != null) {
                sum += cur2.val;
                cur2 = cur2.next;
            }
            cur.next = new ListNode(sum % 10);
            payload = sum / 10;
            cur = cur.next;
        }
        if (payload != 0) {
            cur.next = new ListNode(payload);
        }
        return res.next;
    }
}
```

### Reverse Linked List - 206
Easy
{:.badge.e}
#### Problem
```text
Reverse a singly linked list.

Example:
Input: 1->2->3->4->5->NULL
Output: 5->4->3->2->1->NULL

Follow up:
A linked list can be reversed either iteratively or recursively. 
Could you implement both?
```
#### Solution
Iteratively
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode cur = head, pre = null;
        while (cur != null) {
            ListNode next = cur.next;
            cur.next = pre;
            pre = cur;
            cur = next;
        }
        return pre;
    }
}
```
Recursively
```java
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) return head;  // head == null handle null input
        ListNode res = reverseList(head.next);  // go straight to the tail
        head.next.next = head;
        head.next = null;
        return res;
    }
}
```

### Middle of the Linked List - 876
Easy
{:.badge.e}
#### Problem
```text
Given a non-empty, singly linked list with head node head, return a middle
node of linked list.

If there are two middle nodes, return the second middle node.

Example 1:
Input: [1,2,3,4,5]
Output: Node 3 from this list (Serialization: [3,4,5])
The returned node has value 3.  (The judge's serialization of this node is
[3,4,5]).
Note that we returned a ListNode object ans, such that:
ans.val = 3, ans.next.val = 4, ans.next.next.val = 5, and ans.next.next.next
= NULL.

Example 2:
Input: [1,2,3,4,5,6]
Output: Node 4 from this list (Serialization: [4,5,6])
Since the list has two middle nodes with values 3 and 4, we return the
second one.

Note:
The number of nodes in the given list will be between 1 and 100.
```
#### Solution
```java
class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
}
```


## Tree

### Binary Tree Inorder Traversal - 94
Medium
{:.badge.m}
Traversal
{:.badge}
#### Problem
```text
Given a binary tree, return the inorder traversal of its nodes' values.

Example:

Input: [1,null,2,3]
   1
    \
     2
    /
   3

Output: [1,3,2]

Follow up: Recursive solution is trivial, could you do it iteratively?
```
#### Solution
First start with the recursive approach.
```java
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        trav(root, res);
        return res;
    }
    
    private void trav(TreeNode node, List<Integer> res) {
        if (node != null) {
            trav(node.left, res);
            res.add(node.val);
            trav(node.right, res);
        }    
    }
}
```
Since recursive solution is trivial :), let's do it iteratively!
```java
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode cur = root;

        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {
                stack.push(cur);
                cur = cur.left;
            }
            cur = stack.pop();
            res.add(cur.val);
            cur = cur.right;
        }
        
        return res;
    }
}
```

### Binary Tree Preorder Traversal - 144
Medium
{:.badge.m}
Traversal
{:.badge}
#### Problem
```text
Given a binary tree, return the preorder traversal of its nodes' values.

Example:

Input: [1,null,2,3]
   1
    \
     2
    /
   3

Output: [1,2,3]

Follow up: Recursive solution is trivial, could you do it iteratively?
```
#### Solution
Again, start with the trivial recursive approach.
```java
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        trav(root, res);
        return res;
    }

    private void trav(TreeNode node, List<Integer> res) {
        if (node != null) {
            res.add(node.val);
            trav(node.left, res);
            trav(node.right, res);
        }    
    }
}
```
Then the iterative approach.
```java
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Stack<TreeNode> stack = new Stack<>();
        
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode cur = stack.pop();
            res.add(cur.val);
            if (cur.right != null) stack.push(cur.right);
            if (cur.left != null) stack.push(cur.left);
        }
        
        return res;   
    }
}
```

### Binary Tree Postorder Traversal - 145
Medium
{:.badge.m}
Traversal
{:.badge}
#### Problem
```text
Given a binary tree, return the postorder traversal of its nodes' values.

Example:

Input: [1,null,2,3]
   1
    \
     2
    /
   3

Output: [3,2,1]

Follow up: Recursive solution is trivial, could you do it iteratively?
```
#### Solution
Finally comes the postorder, let's straightforwardly go to the iterative approach.
```java
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        LinkedList<Integer> res = new LinkedList<>();  // <-
        if (root == null) return res;
        Stack<TreeNode> stack = new Stack<>();
        
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode cur = stack.pop();
            res.addFirst(cur.val);  // <-
            if (cur.left != null) stack.push(cur.left);
            if (cur.right != null) stack.push(cur.right);
        }

        return res;
    }
}
```

### Maximum Depth of Binary Tree - 104
Easy
{:.badge.e}
#### Problem
```
Given a binary tree, find its maximum depth.

The maximum depth is the number of nodes along the longest path from the
root node down to the farthest leaf node.

Note: A leaf is a node with no children.

Example:
Given binary tree [3,9,20,null,null,15,7],

⁠   3
⁠  / \
⁠ 9  20
⁠   /  \
⁠  15   7

return its depth = 3.
```
#### Solution
```java
/**
 * Definition for a binary tree node.˙˙
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
    }
}
```

### Binary Tree Maximum Path Sum - 124
Hard
{:.badge.h}
#### Problem
```
Given a non-empty binary tree, find the maximum path sum.

For this problem, a path is defined as any sequence of nodes from some
starting node to any node in the tree along the parent-child connections.
The path must contain at least one node and does not need to go through the
root.

Example 1:

Input: [1,2,3]

⁠      1
⁠     / \
⁠    2   3

Output: 6


Example 2:

Input: [-10,9,20,null,null,15,7]

      -10
      / \
     9  20
    /     \
   15      7

Output: 42
```
#### Solution
The tricky part is, when returning current value, return value of current node + max(left, right)
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    int max = Integer.MIN_VALUE;
    
    public int maxPathSum(TreeNode root) {
        pathSum(root);
        return max;
    }
    
    private int pathSum(TreeNode node) {
        if (node == null) return 0;
        int maxLeft = Math.max(pathSum(node.left), 0);
        int maxRight = Math.max(pathSum(node.right), 0);
        max = Math.max(max, node.val + maxLeft + maxRight);
        return node.val + Math.max(maxLeft, maxRight);
    }
}
```

### Maximum Width of Binary Tree - 662
Medium
{:.badge.m}
#### Problem
```
Given a binary tree, write a function to get the maximum width of the given
tree. The width of a tree is the maximum width among all levels. The binary
tree has the same structure as a full binary tree, but some nodes are null.

The width of one level is defined as the length between the end-nodes (the
leftmost and right most non-null nodes in the level, where the null nodes
between the end-nodes are also counted into the length calculation.

Example 1:
Input: 

⁠          1
⁠        /   \
⁠       3     2
⁠      / \     \  
⁠     5   3     9 

Output: 4
Explanation: The maximum width existing in the third level with the length 4
(5,3,null,9).


Example 2:
Input: 

⁠         1
⁠        /  
⁠       3    
⁠      / \       
⁠     5   3     

Output: 2
Explanation: The maximum width existing in the third level with the length 2
(5,3).


Example 3:
Input: 

⁠         1
⁠        / \
⁠       3   2 
⁠      /        
⁠     5      

Output: 2
Explanation: The maximum width existing in the second level with the length
2 (3,2).


Example 4:
Input: 

⁠         1
⁠        / \
⁠       3   2
⁠      /     \  
⁠     5       9 
⁠    /         \
⁠   6           7
Output: 8
Explanation:The maximum width existing in the fourth level with the length 8
(6,null,null,null,null,null,null,7).

Note: Answer will in the range of 32-bit signed integer.
```
#### Solution
Use a HashMap to keep track of index of each node  
If index of current node is n, index of left child is 2n, index of right child is 2n + 1
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public int widthOfBinaryTree(TreeNode root) {
        if (root == null) return 0;
        
        Queue<TreeNode> queue = new LinkedList<>();
        Map<TreeNode, Integer> map = new HashMap<>();
        queue.offer(root);
        map.put(root, 1);
        int maxWidth = 0;
        
        while (!queue.isEmpty()) {
            int curSize = queue.size();
            int curMin = 0, curMax = 0;
            for (int i = 0; i < curSize; i++) {
                TreeNode curNode = queue.poll();
                int curIdx = map.get(curNode);
                if (curNode.left != null) {
                    map.put(curNode.left, curIdx * 2);
                    queue.offer(curNode.left);
                }
                if (curNode.right != null) {
                    map.put(curNode.right, curIdx * 2 + 1);
                    queue.offer(curNode.right);
                }
                if (i == 0) curMin = curIdx;
                if (i == curSize - 1) curMax = curIdx;
            }
            maxWidth = Math.max(maxWidth, curMax - curMin + 1);
        }
        
        return maxWidth;
    }
}
```

### Invert Binary Tree - 226
Easy
{:.badge.e}
#### Problem
```
Invert a binary tree.

Example:

Input:

     4
   /   \
  2     7
 / \   / \
1   3 6   9

Output:

     4
   /   \
  7     2
 / \   / \
9   6 3   1

Trivia:
This problem was inspired by this original tweet by Max Howell:
    Google: 90% of our engineers use the software you wrote (Homebrew), 
            but you can’t invert a binary tree on a whiteboard so f*** off.
```
#### Solution
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public TreeNode invertTree(TreeNode root) {
        invert(root);
        return root;
    }
    
    private void invert(TreeNode node) {
        if (node == null) return;
        TreeNode left = node.left;
        node.left = node.right;
        node.right = left;
        invert(node.left);
        invert(node.right);
    }
}
```

### Lowest Common Ancestor of a Binary Search Tree - 235
Easy
{:.badge.e}
LCA
{:.badge}
#### Problem
```text
Given a binary search tree (BST), find the lowest common ancestor (LCA) of
two given nodes in the BST.

According to the definition of LCA on Wikipedia: “The lowest common ancestor
is defined between two nodes p and q as the lowest node in T that has both p
and q as descendants (where we allow a node to be a descendant of itself).”

Given binary search tree:  root = [6,2,8,0,4,7,9,null,null,3,5]
```
![tree_image](https://assets.leetcode.com/uploads/2018/12/14/binarysearchtree_improved.png)
```
Example 1:
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
Output: 6
Explanation: The LCA of nodes 2 and 8 is 6.

Example 2:
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
Output: 2
Explanation: The LCA of nodes 2 and 4 is 2, since a node can be a descendant 
of itself according to the LCA definition.
```
#### Solution
Since it's a BST, the LCA is the split point of the two nodes, we could easily find it with this property. 
```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode cur = root;
        
        while (cur != null) {
            if (cur.val < p.val && cur.val < q.val) {
                cur = cur.right;
            } else if (cur.val > p.val && cur.val > q.val) {
                cur = cur.left;
            } else {
                return cur;
            }
        }
        
        return null;
    }
}
```

### Lowest Common Ancestor of a Binary Tree - 236
Medium
{:.badge.m}
LCA
{:.badge}
#### Problem
```text
Given a binary tree, find the lowest common ancestor (LCA) of two given
nodes in the tree.

According to the definition of LCA on Wikipedia: “The lowest common ancestor
is defined between two nodes p and q as the lowest node in T that has both p
and q as descendants (where we allow a node to be a descendant of itself).”

Given the following binary tree:  root = [3,5,1,6,2,0,8,null,null,7,4]
```
![tree_image](https://assets.leetcode.com/uploads/2018/12/14/binarytree.png)
```text
Example 1:
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
Output: 3
Explanation: The LCA of nodes 5 and 1 is 3.

Example 2:
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
Output: 5
Explanation: The LCA of nodes 5 and 4 is 5, since a node can be a descendant 
of itself according to the LCA definition.
 
Note:
All of the nodes' values will be unique.
p and q are different and both values will exist in the binary tree.
```
#### Solution
Without the property of BST, we cannot easily find the LCA by a split point.  
The idea here is to use a map to point each nodes to their parent nodes.   
1. Iterate down through the root node until p and q was found, then we have all the ancestor nodes of p & q.   
2. Add all ancestors of p into a set, and finally iterate up through ancestors of q.  
Once a ancestor of q was found in the set, it is the LCA.  

```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null) return null;
        
        Map<TreeNode, TreeNode> map = new HashMap<>();
        Stack<TreeNode> stack = new Stack<>();
        map.put(root, null);
        stack.push(root);
        
        while (!stack.isEmpty()) {
            if (map.containsKey(p) && map.containsKey(q)) break;
            
            TreeNode cur = stack.pop();
            if (cur.right != null) {
                map.put(cur.right, cur);
                stack.push(cur.right);
            }
            if (cur.left != null) {
                map.put(cur.left, cur);
                stack.push(cur.left);
            }
        }
        
        Set<TreeNode> set = new HashSet<>();
        while (p != null) {
            set.add(p);
            p = map.get(p);
        }
        
        while (q != null) {
            if (set.contains(q)) return q;
            q = map.get(q);
        }
        
        return null;
    }
}
```


### Serialize and Deserialize Binary Tree - 297
Hard
{:.badge.h}
Serialization
{:.badge}
#### Problem
```text
Serialization is the process of converting a data structure or object into a
sequence of bits so that it can be stored in a file or memory buffer, or
transmitted across a network connection link to be reconstructed later in
the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no
restriction on how your serialization/deserialization algorithm should work.
You just need to ensure that a binary tree can be serialized to a string and
this string can be deserialized to the original tree structure.

Example: 
You may serialize the following tree:

⁠   1
⁠  / \
⁠ 2   3
⁠    / \
⁠   4   5

as "[1,2,3,null,null,4,5]"

Clarification: The above format is the same as how LeetCode serializes a
binary tree. You do not necessarily need to follow this format, so please be
creative and come up with different approaches yourself.

Note: Do not use class member/global/static variables to store states. Your
serialize and deserialize algorithms should be stateless.
```
#### Solution

``` java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
 
public class Codec {

    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        StringBuilder res = new StringBuilder();
        seHelper(root, res);
        res.deleteCharAt(res.length() - 1);
        return res.toString();
    }

    private void seHelper(TreeNode root, StringBuilder res) {
        if (root == null) {
            res.append("null,");
            return;
        }
        res.append(root.val).append(",");
        seHelper(root.left, res);
        seHelper(root.right, res);
    }
    
    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {        
        List<String> nodes = Arrays.asList(data.split(","));
        Iterator<String> iter = nodes.iterator();         
        return desHelper(iter);
    }
    
    private TreeNode desHelper(Iterator<String> iter) {        
        String cur = iter.next();
        if (cur.equals("null")) return null;
        TreeNode node = new TreeNode(Integer.valueOf(cur));
        node.left = desHelper(iter);
        node.right = desHelper(iter);
        return node;
    }
} 
```

### Construct Binary Search Tree from Preorder Traversal - 1008
Medium
{:.badge.m}
Serialization
{:.badge}
#### Problem
```
Return the root node of a binary search tree that matches the given preorder
traversal.

(Recall that a binary search tree is a binary tree where for every node, any
descendant of node.left has a value < node.val, and any descendant of
node.right has a value > node.val.  Also recall that a preorder traversal
displays the value of the node first, then traverses node.left, then
traverses node.right.)

Example 1:
Input: [8,5,1,7,10,12]
Output: [8,5,10,1,7,null,12]

Note: 
1 <= preorder.length <= 100
The values of preorder are distinct.
```
#### Solution
The tricky part is to define the upper bound for subtrees
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    private int idx = 0;
    
    public TreeNode bstFromPreorder(int[] preorder) {
        return helper(preorder, Integer.MAX_VALUE);
    }
    
    private TreeNode helper(int[] preorder, int upperBound) {
        if (idx >= preorder.length) return null;
        
        TreeNode cur = new TreeNode(preorder[idx++]);
        
        if (idx < preorder.length && preorder[idx] < cur.val) {
            cur.left = helper(preorder, cur.val);
        } 
        if (idx < preorder.length && preorder[idx] > cur.val && preorder[idx] < upperBound) {
            cur.right = helper(preorder, upperBound);
        }
   
        return cur;
    }

    /* equals to */
    // private TreeNode helper(int[] preorder, int upperBound) {
    //     if (idx >= preorder.length || preorder[idx] > upperBound) return null;
        
    //     TreeNode cur = new TreeNode(preorder[idx++]);
        
    //     cur.left = helper(preorder, cur.val);
    //     cur.right = helper(preorder, upperBound);
   
    //     return cur;
    // }
}
```

## Sort

### Merge Intervals - 56
Medium
{:.badge.m}
Interval
{:.badge}
#### Problem
```
 * Given a collection of intervals, merge all overlapping intervals.
 * 
 * Example 1:
 * Input: [[1,3],[2,6],[8,10],[15,18]]
 * Output: [[1,6],[8,10],[15,18]]
 * Explanation: Since intervals [1,3] and [2,6] overlaps, merge them into
 * [1,6].
 * 
 * Example 2:
 * Input: [[1,4],[4,5]]
 * Output: [[1,5]]
 * Explanation: Intervals [1,4] and [4,5] are considered overlapping.
```
#### Solution
```java
class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length == 0) return intervals;
        
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        // Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        // Arrays.sort(intervals, new Comparator<int[]>() {
        //     public int compare(int[] a, int[] b) {
        //         return a[0] - b[0];
        //     }
        // });
        
        int[][] res = new int[intervals.length][2];
        res[0] = intervals[0];
        int idx = 0;
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] <= res[idx][1]) {
                res[idx][1] = Math.max(res[idx][1], intervals[i][1]);
            } else {
                res[++idx] = intervals[i];
            }
        }
        
        return Arrays.copyOf(res, idx + 1);
    }
}
```

### Meeting Rooms - 252
Easy
{:.badge.e}
Interval
{:.badge}
#### Problem
```
Given an array of meeting time intervals consisting of start and end times 
[[s1,e1],[s2,e2],...] (si < ei), determine if a person could attend all meetings.

Example 1:
Input: [[0,30],[5,10],[15,20]]
Output: false

Example 2:
Input: [[7,10],[2,4]]
Output: true
```
#### Solution
```java
class Solution {
    public boolean canAttendMeetings(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < intervals[i - 1][1]) return false;
        }   
        return true;
    }
}
```

### Meeting Rooms II - 253
Medium
{:.badge.m}
Interval
{:.badge}
Priority Queue
{:.badge}
#### Problem
```
Given an array of meeting time intervals consisting of start and end times
[[s1,e1],[s2,e2],...] (si < ei), find the minimum number of conference rooms required.
  
Example 1:
Input: [[0, 30],[5, 10],[15, 20]]
Output: 2

Example 2:
Input: [[7,10],[2,4]]
Output: 1
```
#### Solution
It's a good one.
```
original:
-----
    -----
  -----
       -----

sort by start time:
-----
  -----
    -----
       -----
```
we want to know if next interval's start is bigger than someone before, if it's we can reuse that room.  
The point is how to find the room that earlest ending room.
```java
class Solution {
    public int minMeetingRooms(int[][] intervals) {
        if (intervals.length == 0) return 0;
        
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);        
        PriorityQueue<Integer[]> minQ = new PriorityQueue<>((a, b) -> a[1] - b[1]);
        
        for (int[] i : intervals) {
            // if current interval's start time > smallest end time in the minQ, then we know we can use that room
            // otherwise, we need a new room
            if (!minQ.isEmpty() && i[0] >= minQ.peek()[1]) minQ.poll();
            minQ.offer(new Integer[]{i[0], i[1]});
        }
        
        return minQ.size();
    }
}
```

### Sort an Array - 912
Medium
{:.badge.m}
Quick Sort
{:.badge}
#### Problem
```
Given an array of integers nums, sort the array in ascending order.

Example 1:
Input: [5,2,3,1]
Output: [1,2,3,5]

Example 2:
Input: [5,1,1,2,0,0]
Output: [0,0,1,1,2,5]

Note:
1 <= A.length <= 10000
-50000 <= A[i] <= 50000
```
#### Solution
```java
class Solution {
    public int[] sortArray(int[] nums) {
        quickSort(nums, 0, nums.length - 1);
        return nums;
    }
    
    public void quickSort(int[] nums, int lo, int hi) {
        if (lo < hi) {
            int pivotIdx = partition(nums, lo, hi);
            quickSort(nums, lo, pivotIdx - 1);
            quickSort(nums, pivotIdx + 1, hi);
        }
    }
    
    private int partition(int[] nums, int lo, int hi) {
        int pivot = nums[hi];
        int idx = lo;  // idx that element < pivot
        
        for (int i = lo; i < hi; i++) {
            if (nums[i] <= pivot) {
                swap(nums, i, idx++);
            }
        }
        swap(nums, hi, idx);
        
        return idx;
    }
    
    private void swap(int[] nums, int i, int j) {
        int tmp = nums[i];
        nums[i] = nums[j];
        nums[j] = tmp;
    }
}
```

### Kth Largest Element in an Array - 215
Medium
{:.badge.m}
Priority Queue
{:.badge}
Quick Select
{:.badge}
#### Problem
```text
Find the kth largest element in an unsorted array. Note that it is the kth
largest element in the sorted order, not the kth distinct element.

Example 1:
Input: [3,2,1,5,6,4] and k = 2
Output: 5

Example 2:
Input: [3,2,3,1,2,4,5,5,6] and k = 4
Output: 4

Note: 
You may assume k is always valid, 1 ≤ k ≤ array's length.
```
#### Solution
**Naive approach**, simply sort the array. Time complexity: `O(nlogn)`
```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        Arrays.sort(nums);
        return nums[nums.length - k];
    }
}
```
**Priority queue approach**, use a min-heap to keep the first k largest element. Time complexity: `O(nlogk)`  
**Note**: max-heap comparator: `(n1, n2) -> n2 - n1` or `Collections.reverseOrder()` 
```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> minQ = new PriorityQueue<>();
        for (int i : nums) {
            minQ.offer(i);
            if (minQ.size() > k) {
                minQ.poll();
            }
        }
        return minQ.poll();
    }
}
```
And...Python Hack!
```python
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        return heapq.nlargest(k, nums)[-1]
```
**Quick Select**, Time complexity: `O(n)`
```java
class Solution {
    // Quick Select Solution
    public int findKthLargest(int[] nums, int k) {
        return quickSelect(nums, nums.length - k, 0, nums.length - 1);
    }
    
    public int quickSelect(int[] nums, int kth, int lo, int hi) {
        if (lo < hi) {
            int pi = partition(nums, lo, hi);
            if (pi == kth) {
                return nums[pi];
            } else if (pi < kth) {
                return quickSelect(nums, kth, pi + 1, hi);
            } else {
                return quickSelect(nums, kth, lo, pi - 1);
            }
        }
        return nums[kth];
    }
    
    private int partition(int[] nums, int lo, int hi) {
        // // Simple Pivot
        // int pivot = nums[hi];

        // Randomized pivot
        Random random = new Random();
        int pivotIndex = lo + random.nextInt(hi - lo);
        int pivot = nums[pivotIndex];
        swap(nums, pivotIndex, hi);

        int i = lo - 1;
        for (int j = lo; j < hi; j++) {
            if (pivot > nums[j]) {
                swap(nums, ++i, j);
            }
        }
        swap(nums, i + 1, hi);
        return i + 1;
    }
    
    private void swap(int[] nums, int i, int j) {
        int tmp = nums[i];
        nums[i] = nums[j];
        nums[j] = tmp;
    }
}
```

### K Closest Points to Origin - 973
Medium
{:.badge.m}
Priority Queue
{:.badge}
Quick Select
{:.badge}
#### Problem
```text
We have a list of points on the plane.  Find the K closest points to the
origin (0, 0).

(Here, the distance between two points on a plane is the Euclidean
distance.)

You may return the answer in any order.  The answer is guaranteed to be
unique (except for the order that it is in.)

Example 1:
Input: points = [[1,3],[-2,2]], K = 1
Output: [[-2,2]]

Explanation: 
The distance between (1, 3) and the origin is sqrt(10).
The distance between (-2, 2) and the origin is sqrt(8).
Since sqrt(8) < sqrt(10), (-2, 2) is closer to the origin.
We only want the closest K = 1 points from the origin, so the answer is just
[[-2,2]].

Example 2:
Input: points = [[3,3],[5,-1],[-2,4]], K = 2
Output: [[3,3],[-2,4]]
(The answer [[-2,4],[3,3]] would also be accepted.)

Note:
1 <= K <= points.length <= 10000
-10000 < points[i][0] < 10000
-10000 < points[i][1] < 10000
```
#### Solution
这个题真的写的要被java气死了  
arraylist里存int[]都研究好半天，List<Integer[]>还不行，只能写List<int[]>  
这就算了，总算是存进去了，以为就这样结束了  
结果List<int[]> 转成int[][]又出现了问题: )  
行，建个array一个个读了再存进去行吧  
结果这个k closest和上面那个kth还不一样，这个是前k个  
那现在array初始化又有问题  
太气了，这题还是用python写了
```java
class Solution {
    public int[][] kClosest(int[][] points, int K) {
        Map<Integer, List<int[]>> map = new HashMap<>();
        for (int[] point : points) {
            int dist = point[0] * point[0] + point[1] * point[1];
            List<int[]> tmp = map.getOrDefault(dist, new ArrayList<int[]>());
            tmp.add(point);
            map.put(dist, tmp);
        }
        PriorityQueue<Integer> pq = new PriorityQueue<>((n1, n2) -> n2 - n1);
        for (int i : map.keySet()) {
            pq.add(i);
            if (pq.size() > K) {
                pq.poll();
            }
        }
        // 辣鸡java 这个arraylist转int[][]写的我想砸电脑
        // int res[][] = new int[points.length][2];  // 这样写是答案是不对的，会多出好多[0, 0]
        // 哦我以为相同距离是不算的，大半夜脑子不清醒了，那直接初始化长度k就行了
        int res[][] = new int[K][2];
        int index = 0;
        while (!pq.isEmpty()) {
            List<int[]> list = map.get(pq.poll());
            for (int i = 0; index < K && i < list.size(); i++) {
                res[index] = list.get(i);
            }
            index++;
        }
        return res;
    }
}
```
python用这个思路写不要再简单  
不过写到这里也发现按照上面kth那题的思路写确实有问题  
用map存的话取前k个只能粗暴的根据res的长度来判断要不要继续往res里加  
这样的话多了这么多麻烦确实还不如答案里的直接sort，复杂度也就是nlogn比上nlogk，省好多事呢
```python
class Solution:
    def kClosest(self, points: List[List[int]], K: int) -> List[List[int]]:
        map = {}
        for point in points:
            dist = point[0]**2 + point[1]**2
            tmp = map.get(dist, [])
            tmp.append(point)
            map[dist] = tmp
        res = []
        for i in heapq.nsmallest(K, list(map.keys())):
            # python没有flatten也有点难受
            for j in map[i]:
                if len(res) < K:
                    res.append(j)
                else:
                    return res
        return res
```
最后发现这个题做这么难受是题目的理解有问题  
最开始以为k closest是第k个，结果是前k个  
前k个的话就导致一个很严重的问题，我是按照第k个来想的，所以才用了hashmap存了所有点的距离  
如果是前k个的话，那pq在这里的作用就和上面kth的完全一样了，最后得到第k个点的距离就行  
下面是正确理解题意后的pq解法
```java
class Solution {
    public int[][] kClosest(int[][] points, int K) {
        PriorityQueue<Integer> pq = new PriorityQueue<>((n1, n2) -> n2 - n1);
        
        for (int[] point : points) {
            int dist = point[0] * point[0] + point[1] * point[1];
            pq.add(dist);
            if (pq.size() > K) {
                pq.poll();
            }
        }
        
        int kthDist = pq.poll();
        int[][] res = new int[K][2];    
        int x = 0;
        
        for (int i = 0; i < points.length; i++) {
            int[] point = points[i];
            if (point[0] * point[0] + point[1] * point[1] <= kthDist) {
                res[x++] = point;
            }
        }
        return res;
    }
}
```
接下来的是java的sort的写法的非常的dry的code
```java
class Solution {
    public int[][] kClosest(int[][] points, int K) {
        int[] dists = new int[points.length];

        for (int i = 0; i < points.length; i++) {
            int[] point = points[i];
            dists[i] = point[0] * point[0] + point[1] * point[1];
        }

        Arrays.sort(dists);
        int kthDist = dists[K - 1];
        int[][] res = new int[K][2];
        int x = 0;

        for (int i = 0; i < points.length; i++) {
            int[] point = points[i];
            if (point[0] * point[0] + point[1] * point[1] <= kthDist) {
                res[x++] = point;
            }
        }
        return res;
    }
}
```
然而lc里跑起来sort的解法比pq快？而且还快不少：）

damn..看了一眼讨论区，还能这么干的吗..  
```java
class Solution {
    public int[][] kClosest(int[][] points, int K) {
        Arrays.sort(points, (p1, p2) -> p1[0] * p1[0] + p1[1] * p1[1] - p2[0] * p2[0] - p2[1] * p2[1]);
        return Arrays.copyOfRange(points, 0, K);
    }
}
```
java对不起

**Quick Select**
```java
class Solution {
    /* Quick Select */
    public int[][] kClosest(int[][] points, int K) {
        quickSelect(points, K, 0, points.length - 1);
        return Arrays.copyOf(points, K);
    }
    
    public void quickSelect(int[][] nums, int k, int lo, int hi) {
        if (lo < hi) {
            int pi = partition(nums, lo, hi);
            if (pi == k - 1) return;
            if (pi < k - 1) quickSelect(nums, k, pi + 1, hi);
            else quickSelect(nums, k, lo, pi - 1);
        }
    }
    
    private int partition(int[][] nums, int lo, int hi) {
        int[] pivot = nums[hi];
        int idx = lo;
        for (int i = lo; i < hi; i++) {
            if (distance(nums[i]) <= distance(pivot)) {
                swap(nums, i, idx);
                idx++;
            }
        }
        swap(nums, idx, hi);
        return idx;
    }
    
    private void swap(int[][] nums, int i, int j) {
        int[] tmp = nums[i];
        nums[i] = nums[j];
        nums[j] = tmp;
    }
    
    private int distance(int[] point) {
        return point[0] * point[0] + point[1] * point[1];
    }
}
```


## Backtrack

### Generate Parentheses - 22
Medium
{:.badge.m}
#### Problem
```text
Given n pairs of parentheses, write a function to generate all combinations
of well-formed parentheses.

For example, given n = 3, a solution set is:
[
⁠ "((()))",
⁠ "(()())",
⁠ "(())()",
⁠ "()(())",
⁠ "()()()"
]
```
#### Solution
```java
class Solution {
    /* runtime / space : O(4^n / sqrt(n)) */
    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        helper(n, 0, new StringBuilder(), res);
        return res;
    }
    
    private void helper(int l, int r, StringBuilder cur, List<String> res) {
        if (l == 0 && r == 0) {
            res.add(cur.toString());
            return;
        }
        if (l > 0) {
            cur.append("(");
            helper(l - 1, r + 1, cur, res);
            cur.deleteCharAt(cur.length() - 1);
        }
        if (r > 0) {
            cur.append(")");
            helper(l, r - 1, cur, res);
            cur.deleteCharAt(cur.length() - 1);
        }
    }
}
```

### Combination Sum - 39
Medium
{:.badge.m}
#### Problem
```text
Given a set of candidate numbers (candidates) (without duplicates) and a
target number (target), find all unique combinations in candidates where the
candidate numbers sums to target.

The same repeated number may be chosen from candidates unlimited number of
times.

Note:
All numbers (including target) will be positive integers.
The solution set must not contain duplicate combinations.

Example 1:
Input: candidates = [2,3,6,7], target = 7,
A solution set is:
[
⁠ [7],
⁠ [2,2,3]
]

Example 2:
Input: candidates = [2,3,5], target = 8,
A solution set is:
[
 [2,2,2,2],
 [2,3,3],
 [3,5]
]
```
#### Solution
```java
class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new LinkedList<>();
        find(candidates, target, 0, new ArrayList<>(), res);
        return res;
    }
    
    private void find(int[] candidates, int target, int index, List<Integer> comb, List<List<Integer>> res) {
        if (target < 0) return;
        if (target == 0) {
            res.add(new ArrayList<>(comb));
            return;
        }
        for (int i = index; i < candidates.length; i++) {
            comb.add(candidates[i]);
            find(candidates, target - candidates[i], i, comb, res);
            comb.remove(comb.size() - 1);
        }
    }
}
```

### Combination Sum II - 40
Medium
{:.badge.m}
#### Problem
```text
Given a collection of candidate numbers (candidates) and a target number
(target), find all unique combinations in candidates where the candidate
numbers sums to target.

Each number in candidates may only be used once in the combination.

Note:
All numbers (including target) will be positive integers.
The solution set must not contain duplicate combinations.

Example 1:
Input: candidates = [10,1,2,7,6,1,5], target = 8,
A solution set is:
[
⁠ [1, 7],
⁠ [1, 2, 5],
⁠ [2, 6],
⁠ [1, 1, 6]
]

Example 2:
Input: candidates = [2,5,2,1,2], target = 5,
A solution set is:
[
[1,2,2],
[5]
]
```
#### Solution
```java
class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> res = new LinkedList<>();
        find(candidates, target, 0, new ArrayList<>(), res);
        return res;
    }
    
    private void find(int[] candidates, int target, int index, List<Integer> comb, List<List<Integer>> res) {
        if (target < 0) return;
        if (target == 0) {
            res.add(new ArrayList<>(comb));
            return;
        }
        for (int i = index; i < candidates.length; i++) {
            if (i > index && candidates[i] == candidates[i - 1]) continue;  // tql
            
            comb.add(candidates[i]);
            find(candidates, target - candidates[i], i + 1, comb, res);
            comb.remove(comb.size() - 1);
        }
    }
}
```

### Permutations - 46
Medium
{:.badge.m}
#### Problem
```text
Given a collection of distinct integers, return all possible permutations.

Example:
Input: [1,2,3]
Output:
[
⁠ [1,2,3],
⁠ [1,3,2],
⁠ [2,1,3],
⁠ [2,3,1],
⁠ [3,1,2],
⁠ [3,2,1]
]
```
#### Solition
```java
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        helper(nums, 0, res);
        return res;
    }
    
    private void helper(int[] nums, int idx, List<List<Integer>> res) {
        if (idx == nums.length - 1) {
            List<Integer> cur = new ArrayList<>();
            for (int i : nums) {
                cur.add(i);
            }
            res.add(cur);            
            return;
        }
        
        for (int i = idx; i < nums.length; i++) {
            swap(nums, idx, i);
            helper(nums, idx + 1, res);  // <-- idx
            swap(nums, idx, i);
        }
    }
    
    private void swap(int[] nums, int i, int j) {
        int tmp = nums[i];
        nums[i] = nums[j];
        nums[j] = tmp;
    }
}
```

### Permutations II - 47
Medium
{:.badge.m}
#### Problem
```text
Given a collection of numbers that might contain duplicates, return all
possible unique permutations.

Example:

Input: [1,1,2]
Output:
[
⁠ [1,1,2],
⁠ [1,2,1],
⁠ [2,1,1]
]
```
#### Solution
Only need to make sure that the same element will not be permuted twice
```java
class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        helper(nums, 0, res);
        return res;
    }
    
    private void helper(int[] nums, int idx, List<List<Integer>> res) {
        if (idx == nums.length - 1) {
            List<Integer> cur = new ArrayList<>();
            for (int i : nums) {
                cur.add(i);
            }
            res.add(cur);            
            return;
        }
        
        Set<Integer> visited = new HashSet<>();  // <--
        
        for (int i = idx; i < nums.length; i++) {
            if (visited.contains(nums[i])) continue;  // <--
            visited.add(nums[i]);
            
            swap(nums, idx, i);
            helper(nums, idx + 1, res);
            swap(nums, idx, i);
        }
    }
    
    private void swap(int[] nums, int i, int j) {
        int tmp = nums[i];
        nums[i] = nums[j];
        nums[j] = tmp;
    }
}
```

### Subsets - 78
Medium
{:.badge.m}
#### Problem
```text
Given a set of distinct integers, nums, return all possible subsets 
(the power set).

Note: The solution set must not contain duplicate subsets.

Example:
Input: nums = [1,2,3]
Output:
[
 ⁠[3],
 [1],
 [2],
 [1,2,3],
 [1,3],
 [2,3],
 [1,2],
 []
]
```
#### Solution
```java
class Solution {
    // Recursive
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        helper(nums, 0, new ArrayList<>(), res);
        return res;
    }
    
    private void helper(int[] nums, int idx, List<Integer> cur, List<List<Integer>> res) {
        if (idx == nums.length) {
            res.add(new ArrayList<>(cur));
            return;
        }
        helper(nums, idx + 1, cur, res);
        cur.add(nums[idx]);
        helper(nums, idx + 1, cur, res);
        cur.remove(cur.size() - 1);
    }
}
```
Alternative way for the helper method, can easily be optmized for follow up (with duplicate element)
```java
    private void helper(int[] nums, int idx, List<Integer> cur, List<List<Integer>> res) {
        if (idx <= nums.length) {  <--
            res.add(new ArrayList<>(cur));
        }
        
        for (int i = idx; i < nums.length; i++) {
            // if (i > idx && nums[i] == nums[i - 1]) continue;  // rm dup
            cur.add(nums[i]);
            helper(nums, i + 1, cur, res);
            cur.remove(cur.size() - 1);
        }
    }
```

### Subsets II - 90
Medium
{:.badge.m}
#### Problem
```text
Given a collection of integers that might contain duplicates, nums, return
all possible subsets (the power set).

Note: The solution set must not contain duplicate subsets.

Example:


Input: [1,2,2]
Output:
[
⁠ [2],
⁠ [1],
⁠ [1,2,2],
⁠ [2,2],
⁠ [1,2],
⁠ []
]
```
#### Solution
```java
class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        helper(nums, 0, new ArrayList<>(), res);
        return res;
    }
    
    private void helper(int[] nums, int idx, List<Integer> cur, List<List<Integer>> res) {
        if (idx <= nums.length) {
            res.add(new ArrayList<>(cur));
        }
        
        for (int i = idx; i < nums.length; i++) {
            if (i > idx && nums[i] == nums[i - 1]) continue;  // rm dup
            cur.add(nums[i]);
            helper(nums, i + 1, cur, res);
            cur.remove(cur.size() - 1);
        }
    }
}
```

### Word Break - 139
Medium
{:.badge.m}
Memoization
{:.badge}
#### Problem
```text
Given a non-empty string s and a dictionary wordDict containing a list of
non-empty words, determine if s can be segmented into a space-separated
sequence of one or more dictionary words.

Note:
The same word in the dictionary may be reused multiple times in the
segmentation.
You may assume the dictionary does not contain duplicate words.

Example 1:
Input: s = "leetcode", wordDict = ["leet", "code"]
Output: true
Explanation: Return true because "leetcode" can be segmented as "leet
code".

Example 2:
Input: s = "applepenapple", wordDict = ["apple", "pen"]
Output: true
Explanation: Return true because "applepenapple" can be segmented as "apple
pen apple".
Note that you are allowed to reuse a dictionary word.

Example 3:
Input: s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
Output: false
```
#### Solution
```java
class Solution {
    Map<String, Boolean> memo;  // memoization
    
    public boolean wordBreak(String s, List<String> wordDict) {
        this.memo = new HashMap<>();
        return find(s, new HashSet<>(wordDict));
    }
        
    private boolean find(String s, Set<String> dict) {
        if (s.equals("")) return true;
        if (memo.containsKey(s)) return memo.get(s);  // memoized
        
        for (int i = 1; i <= s.length(); i++) {  // be careful about the index
            if (dict.contains(s.substring(0, i)) && find(s.substring(i), dict)) {
                memo.put(s, true);  // memoize
                return true;
            }
        }
        
        memo.put(s, false);  // memoize
        return false;
    }
}
```
Recursion stack
```text
/*
    "catsandog"
    ["cats", "dog", "sand", "and", "cat"]

    >>> c
    >>> ca
    >>> cat
    >>> s
    >>> sa
    >>> san
    >>> sand
    >>> o
    >>> og
    og <-- false
    >>> sando
    >>> sandog
    sandog <-- false
    >>> cats
    >>> a
    >>> an
    >>> and
    og -memo-> false
    >>> ando
    >>> andog
    andog <-- false
    >>> catsa
    >>> catsan
    >>> catsand
    >>> catsando
    >>> catsandog
    catsandog <-- false
*/
/*
    "aaaaab"
    ["a","aa","aaa"]

    >>> a
    >>> a
    >>> a
    >>> a
    >>> a
    >>> b
    b <-- false
    >>> ab
    ab <-- false
    >>> aa
    b -memo-> false
    >>> aab
    aab <-- false
    >>> aa
    ab -memo-> false
    >>> aaa
    b -memo-> false
    >>> aaab
    aaab <-- false
    >>> aa
    aab -memo-> false
    >>> aaa
    ab -memo-> false
    >>> aaaa
    >>> aaaab
    aaaab <-- false
    >>> aa
    aaab -memo-> false
    >>> aaa
    aab -memo-> false
    >>> aaaa
    >>> aaaaa
    >>> aaaaab
    aaaaab <-- false
*/
```

### Word Break II - 140
Hard
{:.badge.h}
#### Problem
```text
Given a non-empty string s and a dictionary wordDict containing a list of
non-empty words, add spaces in s to construct a sentence where each word is
a valid dictionary word. Return all such possible sentences.

Note:
The same word in the dictionary may be reused multiple times in the
segmentation.
You may assume the dictionary does not contain duplicate words.

Example 1:
Input:
s = "catsanddog"
wordDict = ["cat", "cats", "and", "sand", "dog"]
Output:
[
"cats and dog",
"cat sand dog"
]

Example 2:
Input:
s = "pineapplepenapple"
wordDict = ["apple", "pen", "applepen", "pine", "pineapple"]
Output:
[
"pine apple pen apple",
"pineapple pen apple",
"pine applepen apple"
]
Explanation: Note that you are allowed to reuse a dictionary word.

Example 3:
Input:
s = "catsandog"
wordDict = ["cats", "dog", "sand", "and", "cat"]
Output:
[]
```
#### Solution
`TODO`


## BFS / DFS

### Minimum Path Sum - 64
Medium
{:.badge.m}
DFS
{:.badge}
Memoization
{:.badge}
#### Problem
```
Given a m x n grid filled with non-negative numbers, find a path from top
left to bottom right which minimizes the sum of all numbers along its path.

Note: You can only move either down or right at any point in time.

Example:

Input:
[
[1,3,1],
⁠ [1,5,1],
⁠ [4,2,1]
]
Output: 7
Explanation: Because the path 1→3→1→1→1 minimizes the sum.
```
#### Solution
Since for each step, we can only choose to go down or right, the grapth itself can be treat as a kind of binary tree.  
The difference with regular tree traversal is that, we cannot simply return at a random null node, because we just want the bottom right node.  
So at the null node, instead of return 0, we return Integer.MAX_VALUE, this will ensure the the returnd route will always pass the bottom right node.  
```java
class Solution {    
    public int minPathSum(int[][] grid) {
        if (grid.length == 0) return 0;
        return dfs(grid, 0, 0);
    }
    
    // it's a kind of binary tree
    // how to ensure reach the bottom right note?
    private int dfs(int[][] grid, int r, int c) {
        if (r >= grid.length || c >= grid[0].length) return Integer.MAX_VALUE;
        
        if (r == grid.length - 1 && c == grid[0].length - 1) {      
            return grid[r][c];
        }
            
        return Math.min(dfs(grid, r + 1, c), dfs(grid, r, c + 1)) + grid[r][c];
    }
}
```
With can avoid access a node twice with memoization
```java
class Solution {    
    private int[][] memo;
    
    public int minPathSum(int[][] grid) {
        if (grid.length == 0) return 0;
        
        memo = new int[grid.length][grid[0].length];        
        return dfs(grid, 0, 0);
    }
    
    private int dfs(int[][] grid, int r, int c) {
        if (r >= grid.length || c >= grid[0].length) {
            return Integer.MAX_VALUE;
        }
        
        if (r == grid.length - 1 && c == grid[0].length - 1) {      
            return grid[r][c];
        }
        
        if (memo[r][c] != 0) {
            return memo[r][c];
        }
            
        memo[r][c] = Math.min(dfs(grid, r + 1, c), dfs(grid, r, c + 1)) + grid[r][c];
        
        return memo[r][c];        
    }
}
```

### Word Ladder - 127
Medium
{:.badge.m}
BFS
{:.badge}
#### Problem
```text
Given two words (beginWord and endWord), and a dictionary's word list, find
the length of shortest transformation sequence from beginWord to endWord,
such that:

Only one letter can be changed at a time.
Each transformed word must exist in the word list. Note that beginWord is
not a transformed word.

Note:
Return 0 if there is no such transformation sequence.
All words have the same length.
All words contain only lowercase alphabetic characters.
You may assume no duplicates in the word list.
You may assume beginWord and endWord are non-empty and are not the same.


Example 1:

Input:
beginWord = "hit",
endWord = "cog",
wordList = ["hot","dot","dog","lot","log","cog"]

Output: 5
Explanation: As one shortest transformation is "hit" -> "hot" -> "dot" ->
"dog" -> "cog",
return its length 5.


Example 2:

Input:
beginWord = "hit"
endWord = "cog"
wordList = ["hot","dot","dog","lot","log"]

Output: 0
Explanation: The endWord "cog" is not in wordList, therefore no possible
transformation.
```
#### Solution
```java
class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Map<String, List<String>> wildDict = new HashMap<>();
        Map<String, Integer> discoverMap = new HashMap<>();
        Queue<String> q = new LinkedList<>();

        // construct wildcard dict
        for (String word : wordList) {
            for (int i = 0; i < word.length(); i++) {
                String w = word.substring(0, i) + "*" + word.substring(i + 1);
                List<String> list = wildDict.getOrDefault(w, new ArrayList<>());
                list.add(word);
                wildDict.put(w, list);
            }
        }
        
        // bfs
        discoverMap.put(beginWord, 1);
        q.offer(beginWord);
        while (!q.isEmpty()) {
            String word = q.poll();
            for (int i = 0; i < word.length(); i++) {
                
                // find all adjacent words
                String wildWord = word.substring(0, i) + "*" + word.substring(i + 1);
                if (wildDict.containsKey(wildWord)) {
                    for (String adjWord : wildDict.get(wildWord)) {
                        int level = discoverMap.get(word) + 1;
                        if (adjWord.equals(endWord)) {
                            return level;
                        }
                        
                        // if not discovered yet, add to discover map
                        if (!discoverMap.containsKey(adjWord)) {
                            discoverMap.put(adjWord, level);
                            q.offer(adjWord);
                        }
                    }
                }
            }
        }
        
        return 0;
    }
}
```

### Word Ladder II - 126
Hard
{:.badge.h}
BFS
{:.badge}
#### Problem
```text
Given two words (beginWord and endWord), and a dictionary's word list, find
all shortest transformation sequence(s) from beginWord to endWord, such
that:

Only one letter can be changed at a time
Each transformed word must exist in the word list. Note that beginWord is
not a transformed word.

Note:
Return an empty list if there is no such transformation sequence.
All words have the same length.
All words contain only lowercase alphabetic characters.
You may assume no duplicates in the word list.
You may assume beginWord and endWord are non-empty and are not the same.


Example 1:

Input:
beginWord = "hit",
endWord = "cog",
wordList = ["hot","dot","dog","lot","log","cog"]

Output:
[
⁠ ["hit","hot","dot","dog","cog"],
["hit","hot","lot","log","cog"]
]


Example 2:

Input:
beginWord = "hit"
endWord = "cog"
wordList = ["hot","dot","dog","lot","log"]

Output: []

Explanation: The endWord "cog" is not in wordList, therefore no possible
transformation.
```
#### Solution
```java
class Solution {
    /* BFS with Q */
    public List<List<String>> findLadders(String beginWord, String endWord, List<String> wordList) {
        List<List<String>> res = new ArrayList<>();
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord)) return res;

        Map<String, List<String>> wordMap = new HashMap<>();
        for (String word : wordList) {
            for (int i = 0; i < word.length(); i++) {
                String wildCard = word.substring(0, i) + "*" + word.substring(i + 1);
                List<String> list = wordMap.getOrDefault(wildCard, new ArrayList<>());
                list.add(word);
                wordMap.put(wildCard, list);
            }
        }
        
        Queue<List<String>> q = new LinkedList<>();
        q.offer(new ArrayList<>(Arrays.asList(beginWord)));
        
        while (!q.isEmpty()) {
            int size = q.size();
            Set<String> curWords = new HashSet<>();  // words discovered this layer
            
            for (int x = 0; x < size; x++) {
                List<String> curLadder = q.poll();
                String lastWord = curLadder.get(curLadder.size() - 1);
                if (lastWord.equals(endWord)) {
                    res.add(curLadder);
                } else {
                    for (int i = 0; i < lastWord.length(); i++) {
                        String wildCard = lastWord.substring(0, i) + "*" + lastWord.substring(i + 1);
                        if (wordMap.containsKey(wildCard)) {
                            for (String curWord : wordMap.get(wildCard)) {
                                if (wordSet.contains(curWord)) {
                                    List<String> newLadder = new ArrayList<>(curLadder);
                                    newLadder.add(curWord);
                                    q.offer(newLadder);
                                    curWords.add(curWord);
                                }
                            }
                        }
                    }
                }
            }
            
            if (!res.isEmpty()) return res;
            wordSet.removeAll(curWords);
        }
        
        return res;
    }
}
```
```java
class Solution {
    /* BFS with Map */
    public List<List<String>> findLadders(String beginWord, String endWord, List<String> wordList) {
        List<List<String>> res = new ArrayList<>();
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord)) return res;
        
        Map<String, List<List<String>>> layer = new HashMap<>();  // current layer's word -> all path to word, z -> [[a,b,z],[x,y,z]]
        List<List<String>> tmp = new ArrayList<>();
        tmp.add(new ArrayList<>(Arrays.asList(beginWord)));
        layer.put(beginWord, tmp);  // beginWord -> [[beginWord]]
        
        while (!layer.isEmpty()) {
            Map<String, List<List<String>>> nextLayer = new HashMap<>();
            for (String s : layer.keySet()) {
                if (s.equals(endWord)) {
                    for (List<String> ladder : layer.get(s)) res.add(ladder);
                } else {
                   char[] chars = s.toCharArray();  // toCharArray and avoid string concatenation
                    for (int i = 0; i < s.length(); i++) {  // try to replace each char
                        char org = chars[i];
                        for (char c = 'a'; c <= 'z'; c++) {
                            chars[i] = c;
                            String word = new String(chars);
                            if (wordSet.contains(word)) {    
                                List<List<String>> ladders = nextLayer.getOrDefault(word, new ArrayList<>());
                                for (List<String> ladder : layer.get(s)) {
                                    List<String> tmpLad = new ArrayList<>(ladder);
                                    tmpLad.add(word);
                                    ladders.add(tmpLad);   
                                }
                                nextLayer.put(word, ladders);
                            }
                        }
                        chars[i] = org;
                    }
                }
            }
            if (!res.isEmpty()) return res;
            wordSet.removeAll(nextLayer.keySet());
            layer = nextLayer;
        }
        
        return res;
    }
}
```

### Number of Islands - 200
Medium
{:.badge.m}
DFS
{:.badge}
#### Problem
```text
Given a 2d grid map of '1's (land) and '0's (water), count the number of
islands. An island is surrounded by water and is formed by connecting
adjacent lands horizontally or vertically. You may assume all four edges of
the grid are all surrounded by water.

Example 1:

Input:
11110
11010
11000
00000

Output: 1


Example 2:

Input:
11000
11000
00100
00011

Output: 3
```
#### Solution
```java
class Solution {
    public int numIslands(char[][] grid) {
        int res = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    res++;
                    dfs(grid, r, c);
                }
            }
        }
        return res;
    }
    
    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') {
            return;
        }
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}
```

### Number of Distinct Islands - 694
Medium
{:.badge.m}
DFS
{:.badge}
#### Problem
```text
Given a non-empty 2D array grid of 0's and 1's, an island is a group of 
1's (representing land) connected 4-directionally (horizontal or vertical).
You may assume all four edges of the grid are surrounded by water.

Count the number of distinct islands. An island is considered to be the
same as another if and only if one island has the same shape as another
island (and not rotated or reflected).

Notice that:
11
1
and
 1
11
are considered different island, because we do not consider 
reflection / rotation.

Example 1:
Input: 
[
 [1,1,0,0,1],
 [1,0,0,0,0],
 [1,1,0,0,1],
 [0,1,0,1,1]
]
Output: 3
Explanation:
  11   1    1
  1        11   
  11
   1

Example 2:
Input:
[
 [1,1,0,0,0],
 [1,1,0,0,0],
 [0,0,0,1,1],
 [0,0,0,1,1]
]
Output: 1
```
#### Solution
Since we do not consider reflection / rotation, we can simply log the route of DFS.  
Because DFS will always starts with the top left point of an island, number of distinct islands = number of distinct routes
```java
public class Solution {
    public int numberofDistinctIslands(int[][] grid) {
        Set<String> set = new HashSet<>();
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == 1) {
                    StringBuilder route = new StringBuilder();
                    dfs(grid, r, c, route);
                    set.add(route.toString());
                }
            }
        }
        return set.size();
    }
    
    private void dfs(int[][] grid, int r, int c, StringBuilder route) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] == 0) return;
        
        grid[r][c] = 0;
        
        route.append("u");
        dfs(grid, r - 1, c, route);
        route.append("d");
        dfs(grid, r + 1, c, route);
        route.append("l");
        dfs(grid, r, c - 1, route);
        route.append("r");
        dfs(grid, r, c + 1, route);
    }
}
```

### Number of Closed Islands - 1254
Medium
{:.badge.m}
DFS
{:.badge}
#### Problem
```text
Given a 2D grid consists of 0s (land) and 1s (water). 
An island is a maximal 4-directionally connected group of 0s 
and a closed island is an island totally (all left, top, right, bottom)
surrounded by 1s.

Return the number of closed islands.

Example 1:
Input: grid = [
    [1,1,1,1,1,1,1,0],
    [1,0,0,0,0,1,1,0],
    [1,0,1,0,1,1,1,0],
    [1,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0]
    ]
Output: 2
Explanation: 
Islands in gray are closed because they are completely 
surrounded by water (group of 1s).

Example 2:
Input: grid = [
    [0,0,1,0,0],
    [0,1,0,1,0],
    [0,1,1,1,0]
    ]
Output: 1

Example 3:
Input: grid = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1]
    ]
Output: 2
 
Constraints:
1 <= grid.length, grid[0].length <= 100
0 <= grid[i][j] <=1
```
#### Solution
Exclude connected group of 0s on the corners because they are not closed island.  
Return number of connected component of 0s on the grid.
```java
class Solution {
    public int closedIsland(int[][] grid) {
        int res = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == 0 && isClose(grid, r, c)) {
                    res++;
                }
            }
        }
        return res;
    }
    
    private boolean isClose(int[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return false;
        if (grid[r][c] == 1) return true;
        grid[r][c] = 1;
        // & instead of && !!!
        // "&" will evaluate both side even the left part is false
        // "&&" will ignore the right part if the left part is false
        return isClose(grid, r + 1, c) & isClose(grid, r - 1, c) & isClose(grid, r, c + 1) & isClose(grid, r, c - 1);
    }
}
```

### Course Schedule - 207
Medium
{:.badge.m}
Topological Sort
{:.badge}
#### Problem
```text
There are a total of n courses you have to take, labeled from 0 to n-1.

Some courses may have prerequisites, for example to take course 0 you have
to first take course 1, which is expressed as a pair: [0,1]

Given the total number of courses and a list of prerequisite pairs, is it
possible for you to finish all courses?

Example 1:
Input: 2, [[1,0]] 
Output: true
Explanation: There are a total of 2 courses to take. 
To take course 1 you should have finished course 0. So it is possible.

Example 2:
Input: 2, [[1,0],[0,1]]
Output: false
Explanation: There are a total of 2 courses to take. 
To take course 1 you should have finished course 0, and to take course 0 you
should
also have finished course 1. So it is impossible.

Note:
The input prerequisites is a graph represented by a list of edges, not
adjacency matrices. Read more about how a graph is represented.
You may assume that there are no duplicate edges in the input
prerequisites.
```
#### Solution
```java
class Solution {
    /* Topological Sort Based on DFS Circle Detection */
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        Map<Integer, Set<Integer>> adjMap = new HashMap<>();  // course -> preqs
        Map<Integer, Integer> courses = new HashMap<>();  // 0: not visited, 1: visiting, 2: visited
        for (int[] pre : prerequisites) {
            // assume all pres are pair of 2
            Set<Integer> set = adjMap.getOrDefault(pre[0], new HashSet<>());  
            set.add(pre[1]);
            adjMap.put(pre[0], set);
            courses.put(pre[0], 0);
            courses.put(pre[1], 0);
        }
        for (Integer course : courses.keySet()) {
            if (hasCircle(adjMap, courses, course)) return false;
        }
        return true;
    }
    
    private boolean hasCircle(Map<Integer, Set<Integer>> adjMap, Map<Integer, Integer> vertices, Integer vertice) {
        if (vertices.get(vertice) == 2) return false;
        if (vertices.get(vertice) == 1) return true;
        vertices.put(vertice, 1);  // mark as visiting
        if (adjMap.containsKey(vertice)) {  // if this vertice has forward edges (has preqs)
            for (Integer preq : adjMap.get(vertice)) {
               if (hasCircle(adjMap, vertices, preq)) return true;
            }
        }
        vertices.put(vertice, 2);  // mark as visited
        return false;
    }
}
```
```java
class Solution {
    /* yet another solution */
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        if (numCourses <= 0) return true;
        Queue<Integer> queue = new LinkedList<>();
        int[] todo = new int[numCourses];
        for (int i = 0; i < prerequisites.length; i++) {
            todo[prerequisites[i][0]]++;
        }
        for (int i = 0; i < numCourses; i++) {
            if (todo[i] == 0) {
                queue.add(i);
            }
        }
        while (!queue.isEmpty()) {
            int pre = queue.remove();
            for (int i = 0; i < prerequisites.length; i++) {
                if (pre == prerequisites[i][1]) {
                    if (--todo[prerequisites[i][0]] == 0) {
                        queue.add(prerequisites[i][0]);
                    }
                }
            }
        }
        for (int i = 0; i < numCourses; i++) {
            if (todo[i] != 0) return false;
        }
        return true;
    }
}
```

### Course Schedule II - 210
Medium
{:.badge.m} 
Topological Sort
{:.badge}
#### Problem
```text
There are a total of n courses you have to take, labeled from 0 to n-1.

Some courses may have prerequisites, for example to take course 0 you have
to first take course 1, which is expressed as a pair: [0,1]

Given the total number of courses and a list of prerequisite pairs, return
the ordering of courses you should take to finish all courses.

There may be multiple correct orders, you just need to return one of them.
If it is impossible to finish all courses, return an empty array.

Example 1:
Input: 2, [[1,0]] 
Output: [0,1]
Explanation: There are a total of 2 courses to take. To take course 1 you
should have finished   
course 0. So the correct course order is [0,1] .

Example 2:
Input: 4, [[1,0],[2,0],[3,1],[3,2]]
Output: [0,1,2,3] or [0,2,1,3]
Explanation: There are a total of 4 courses to take. To take course 3 you
should have finished both     
⁠            courses 1 and 2. Both courses 1 and 2 should be taken after you
finished course 0. 
So one correct course order is [0,1,2,3]. Another correct ordering is
[0,2,1,3] .

Note:
The input prerequisites is a graph represented by a list of edges, not
adjacency matrices. Read more about how a graph is represented.
You may assume that there are no duplicate edges in the input
prerequisites.
```
#### Solution
```java
class Solution {
    int[] order;
    int idx;
    
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        order = new int[numCourses];
        idx = 0;
        
        Map<Integer, Set<Integer>> adjMap = new HashMap<>();  // course -> preqs
        Map<Integer, Integer> courses = new HashMap<>();  // 0: not visited, 1: visiting, 2: visited
        for (int[] pre : prerequisites) {
            // assume all pres are pair of 2
            Set<Integer> set = adjMap.getOrDefault(pre[0], new HashSet<>());  
            set.add(pre[1]);
            adjMap.put(pre[0], set);
            courses.put(pre[0], 0);
            courses.put(pre[1], 0);
        }
        for (Integer course : courses.keySet()) {
            if (hasCircle(adjMap, courses, course)) return new int[]{};
        }
        
        for (int i = 0; idx < numCourses && i < numCourses; i++) {  // handle courses that dont have preq
            if (!courses.containsKey(i)) order[idx++] = i;
        }
        
        return order;
    }
    
    private boolean hasCircle(Map<Integer, Set<Integer>> adjMap, Map<Integer, Integer> vertices, Integer vertice) {
        if (vertices.get(vertice) == 2) return false;
        if (vertices.get(vertice) == 1) return true;
        vertices.put(vertice, 1);  // mark as visiting
        if (adjMap.containsKey(vertice)) {  // if this vertice has forward edges (has preqs)
            for (Integer preq : adjMap.get(vertice)) {
               if (hasCircle(adjMap, vertices, preq)) return true;
            }
        }
        vertices.put(vertice, 2);  // mark as visited
        order[idx++] = vertice;  // add course to order
        return false;
    }
}
```


## Dynamic Programming

### Trapping Rain Water - 42
Hard
{:.badge.h}
#### Problem
```text
Given n non-negative integers representing an elevation map where the width
of each bar is 1, compute how much water it is able to trap after raining.

The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1].
In this case, 6 units of rain water (blue section) are being trapped. Thanks
Marcos for contributing this image!

Example:
Input: [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
```
#### Solution
```java
class Solution {
    /* DP */
    public int trap(int[] height) {
        // for each index, amount of rain it can trap = Min(max height of left, max height of right) - height of itself
        // so we want to know, for each index, max height of left so far, and max height of right so far

        int[] maxLeft = new int[height.length];
        int[] maxRight = new int[height.length];
        for (int i = 0; i < height.length; i++) {
            if (i == 0) maxLeft[i] = height[i];
            else maxLeft[i] = Math.max(height[i], maxLeft[i - 1]);
        }
        for (int i = height.length - 1; i >= 0; i--) {
            if (i == height.length - 1) maxRight[i] = height[i];
            else maxRight[i] = Math.max(height[i], maxRight[i + 1]);
        }
        
        int res = 0;
        for (int i = 0; i < height.length; i++) {
            res += Math.min(maxLeft[i], maxRight[i]) - height[i];
        }
        return res;
    }
}
```
```java
class Solution {
    /* Two Pointer */
    public int trap(int[] height) {
        int res = 0;
        int maxLeft = 0, maxRight = 0;
        int le = 0, ri = height.length - 1;
        while (le <= ri) {
            if (maxLeft <= maxRight) {  // if upper bound constrained by left side
                if (height[le] >= maxLeft) maxLeft = height[le];
                else res += maxLeft - height[le];
                le++;
            } else {  // else if upper bound constrained by right side
                if (height[ri] >= maxRight) maxRight = height[ri];
                else res += maxRight - height[ri];
                ri--;
            }
        }
        return res;
    }
}
```

### Jump Game - 55
Medium
{:.badge.m}
Greedy
{:.badge}
#### Problem
```
Given an array of non-negative integers, you are initially positioned at the
first index of the array.

Each element in the array represents your maximum jump length at that
position.

Determine if you are able to reach the last index.

Example 1:
Input: [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last
index.

Example 2:
Input: [3,2,1,0,4]
Output: false
Explanation: You will always arrive at index 3 no matter what. Its
maximum
jump length is 0, which makes it impossible to reach the last index.
```
#### Solution
```java
class Solution {
    public boolean canJump(int[] nums) {
        if (nums.length == 0) return true;
        int canDo = nums[0];
        int i = 0;
        while (canDo > 0 && i < nums.length - 1) {
            canDo = Math.max(--canDo, nums[++i]);
        }
        return i == nums.length - 1;
    }
}
```

### Climbing Stairs - 70
Easy
{:.badge.e}
#### Problem
```text
You are climbing a stair case. It takes n steps to reach to the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can
you climb to the top?

Note: Given n will be a positive integer.

Example 1:
Input: 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps


Example 2:
Input: 3
Output: 3
Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step
```
#### Solution
```java
class Solution {
    /* Recursive Solution */
    public int climbStairs(int n) {
        if (n == 0 || n == 1) return 1;
        return climbStairs(n - 1) + climbStairs(n - 2);
    }

    /* Recursive Solutoin with Memo */
    private Map<Integer, Integer> memo = new HashMap<>();
    
    public int climbStairs(int n) {
        if (n == 0 || n == 1) return 1;
        if (memo.containsKey(n)) return memo.get(n);    
        int stairs = climbStairs(n - 1) + climbStairs(n - 2);
        memo.put(n, stairs);
        return stairs;
    }   
}
```
```java
class Solution {
    /* Bottom Up Solution */
    public int climbStairs(int n) {
        if (n == 1) return 1;
        if (n == 2) return 2;
        
        int n_2 = 1;
        int n_1 = 2;
        for (int i = 3; i <= n; i++) {
            int curWays = n_1 + n_2;
            n_2 = n_1;
            n_1 = curWays;
        }
        return n_1;
    }
}
```

### Maximal Square - 221
Medium
{:.badge.m}
#### Problem
```
Given a 2D binary matrix filled with 0's and 1's, find the largest square
containing only 1's and return its area.

Example:

Input: 

1 0 1 0 0
1 0 1 1 1
1 1 1 1 1
1 0 0 1 0

Output: 4
```
#### Solution
```
dp(i, j) = min(dp(i − 1, j), dp(i − 1, j − 1), dp(i, j − 1)) + 1
```
Use dp[r][c] to represent the state of matrix[r - 1][c - 1] could save us from handling boundaries
```java
class Solution {
    public int maximalSquare(char[][] matrix) {
        if (matrix.length == 0) return 0;
        int[][] dp = new int[matrix.length + 1][matrix[0].length + 1];
        int max = 0;
        for (int r = 1; r <= matrix.length; r++) {
            for (int c = 1; c <= matrix[0].length; c++) {
                if (matrix[r - 1][c - 1] == '1') {
                    dp[r][c] = Math.min(Math.min(dp[r - 1][c], dp[r][c - 1]), dp[r - 1][c - 1]) + 1;
                    max = Math.max(max, dp[r][c]);
                }
            }
        }
        return max * max;
    }
}
```

### Ugly Number - 263
Easy
{:.badge.e}
#### Problem
```text
Write a program to check whether a given number is an ugly number.

Ugly numbers are positive numbers whose prime factors only include 2, 3, 5.

Example 1:
Input: 6
Output: true
Explanation: 6 = 2 × 3

Example 2:
Input: 8
Output: true
Explanation: 8 = 2 × 2 × 2

Example 3:
Input: 14
Output: false 
Explanation: 14 is not ugly since it includes another prime factor 7.

Note:
1 is typically treated as an ugly number.
Input is within the 32-bit signed integer range: [−2^31,  2^31 − 1].
```
#### Solution
```java
class Solution {
    public boolean isUgly(int num) {
        if (num <= 0) return false;
        while (num != 1) {
            if (num % 2 == 0) {
                num /= 2;
            } else if (num % 3 == 0) {
                num /= 3;
            } else if (num % 5 == 0) {
                num /= 5;
            } else {
                return false;
            }            
        }
        return true;
    }
}
```

### Ugly Number II - 264
Medium
{:.badge.m}
#### Problem
```text
Write a program to find the n-th ugly number.

Ugly numbers are positive numbers whose prime factors *only* include 2, 3, 5.

Example:
Input: n = 10
Output: 12
Explanation: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12 is the sequence of the first 10 ugly numbers.

Note:  
1 is typically treated as an ugly number.
n does not exceed 1690.
```
#### Solution
The ugly-number sequence is 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, …  
Because every number can only be divided by 2, 3, 5  
We can get three subsequences by multiply the ugly-sequence itself (1, 2, 3, 5, … ) with 2, 3, 5  
Then we use similar merge method as merge sort, to get every ugly number from the three subsequences  
```java
class Solution {
    public int nthUglyNumber(int n) {        
        int[] ugly = new int[n];
        ugly[0] = 1;
        int idx2 = 0, idx3 = 0, idx5 = 0;
        int num2 = 2, num3 = 3, num5 = 5;
        
        for (int i = 1; i < n; i++) {
            int min = Math.min(Math.min(num2, num3), num5);
            ugly[i] = min;
            // use if to avoid duplicate num
            if (min == num2) {
                num2 = ugly[++idx2] * 2;
            }
            if (min == num3) {
                num3 = ugly[++idx3] * 3;
            } 
            if (min == num5) {
                num5 = ugly[++idx5] * 5;
            }
        }
        
        return ugly[n - 1];
    }
}
```

### Longest Increasing Subsequence - 300
Medium
{:.badge.m}
Subsequence
{:.badge}
#### Problem
```
Given an unsorted array of integers, find the length of longest increasing
subsequence.

Example:
Input: [10,9,2,5,3,7,101,18]
Output: 4 
Explanation: The longest increasing subsequence is [2,3,7,101], therefore
the length is 4. 

Note: 
There may be more than one LIS combination, it is only necessary for you to
return the length.
Your algorithm should run in O(n^2) complexity.

Follow up: Could you improve it to O(n log n) time complexity?
```
#### Solution
```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] maxTill = new int[nums.length];
        int max = 0;
        for (int i = 0; i < nums.length; i++) {
            maxTill[i] = 1;  // sequence with only itself
            for (int j = 0; j < i; j++) {
                if (nums[i] > nums[j] && maxTill[i] < maxTill[j] + 1) {  // if num @i > num @j && length of seq @j + 1 (1 is i itself) > seq @i
                    maxTill[i] = maxTill[j] + 1;
                }
            }
            max = Math.max(max, maxTill[i]);
        }
        return max;
    }
}
```

### Longest Palindromic Subsequence - 516
Medium
{:.badge.m}
Memoization
{:.badge}
Subsequence
{:.badge}
#### Problem
```
Given a string s, find the longest palindromic subsequence's length in s.
You may assume that the maximum length of s is 1000.

Example 1:
Input: 
"bbbab"
Output: 
4
One possible longest palindromic subsequence is "bbbb".

Example 2:
Input:
"cbbd"
Output:
2
One possible longest palindromic subsequence is "bb".
```
#### Solution
```java
public class Solution {
    public int longestPalindromeSubseq(String s) {
        int[][] dp = new int[s.length()][s.length()];
        
        for (int i = s.length() - 1; i >= 0; i--) {
            dp[i][i] = 1;
            for (int j = i+1; j < s.length(); j++) {
                if (s.charAt(i) == s.charAt(j)) {
                    dp[i][j] = Math.max(dp[i+1][j-1] + 2, Math.max(dp[i+1][j], dp[i][j-1]));
                } else {
                    dp[i][j] = Math.max(dp[i+1][j], dp[i][j-1]);
                }
            }
        }
        return dp[0][s.length()-1];
    }
}
```

### Longest Common Subsequence - 1143
Medium
{:.badge.m}
Memoization
{:.badge}
Subsequence
{:.badge}
#### Problem
```
Given two strings text1 and text2, return the length of their longest common
subsequence.

A subsequence of a string is a new string generated from the original string
with some characters(can be none) deleted without changing the relative order of
the remaining characters. (eg, "ace" is a subsequence of "abcde" while "aec" is
not). A common subsequence of two strings is a subsequence that is common to
both strings.

If there is no common subsequence, return 0.

Example 1:
Input: text1 = "abcde", text2 = "ace" 
Output: 3  
Explanation: The longest common subsequence is "ace" and its length is 3.

Example 2:
Input: text1 = "abc", text2 = "abc"
Output: 3
Explanation: The longest common subsequence is "abc" and its length is 3.

Example 3:
Input: text1 = "abc", text2 = "def"
Output: 0
Explanation: There is no such common subsequence, so the result is 0.

Constraints:
1 <= text1.length <= 1000
1 <= text2.length <= 1000
The input strings consist of lowercase English characters only.
```
#### Solution
Found out that `the assignment operator in Java returns the assigned value` ..
```java
class Solution {
    private Integer[][] memo;
    
    public int longestCommonSubsequence(String text1, String text2) {
        this.memo = new Integer[text1.length()][text2.length()];
        return helper(text1, text2, 0, 0);
    }
    
    private int helper(String text1, String text2, int i, int j) {
        if (i == text1.length() || j == text2.length()) return 0;
        
        if (memo[i][j] != null) return memo[i][j];
        
        if (text1.charAt(i) == text2.charAt(j)) {
            return memo[i][j] = helper(text1, text2, i + 1, j + 1) + 1;
        }
        return memo[i][j] = Math.max(helper(text1, text2, i + 1, j), helper(text1, text2, i, j + 1));
    }
}
```


## Design

### LRU Cache - 146
Medium
{:.badge.m}
#### Problem
```text
Design and implement a data structure for Least Recently Used (LRU) cache.
It should support the following operations: get and put.

get(key) - Get the value (will always be po$$sitive) of the key if the key
exists in the cache, otherwise return -1.
put(key, value) - Set or insert the value if the key is not already present.
When the cache reached its capacity, it should invalidate the least recently
used item before inserting a new item.

The cache is initialized with a positive capacity.

Follow up:
Could you do both operations in O(1) time complexity?

Example:
LRUCache cache = new LRUCache(2);  // capacity

cache.put(1, 1);
cache.put(2, 2);
cache.get(1);       // returns 1
cache.put(3, 3);    // evicts key 2
cache.get(2);       // returns -1 (not found)
cache.put(4, 4);    // evicts key 1
cache.get(1);       // returns -1 (not found)
cache.get(3);       // returns 3
cache.get(4);       // returns 4
```
#### Solution
```java
/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache obj = new LRUCache(capacity);
 * int param_1 = obj.get(key);
 * obj.put(key,value);
 */
class LRUCache {

    class Node {
        Integer key;
        Integer val;
        Node prev;
        Node next;
        
        public Node(Integer key, Integer val) {
            this.key = key;
            this.val = val;
        }
        
        public Node() {
            this(null, null);
        }
    }

    private Map<Integer, Node> map;
    private Node head, tail;
    private int capacity;

    public LRUCache(int capacity) {
        this.map = new HashMap<>();
        this.capacity = capacity;
        
        this.head = new Node();
        this.tail = new Node();
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    
    public int get(int key) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            moveToHead(node);
            return node.val;
        }
        return -1;
    }
    
    public void put(int key, int value) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            node.val = value;
            map.put(key, node);
            moveToHead(node);
        } else {
            Node node = new Node(key, value);
            map.put(key, node);
            addToHead(node);
            
            if (map.size() > capacity) {
                Node rm = tail.prev;
                map.remove(rm.key);
                remove(rm);
            }
        }
    }

    private void addToHead(Node node) {
        node.prev = head;
        node.next = head.next;
        head.next = node;
        node.next.prev = node;
    }
    
    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
        node.prev = null;
        node.next = null;
    }
    
    private void moveToHead(Node node) {
        remove(node);
        addToHead(node);
    }
}
```

### Min Stack - 155
Easy
{:.badge.e}
#### Problem
```text
Design a stack that supports push, pop, top, and retrieving the minimum
element in constant time.

push(x) -- Push element x onto stack.
pop() -- Removes the element on top of the stack.
top() -- Get the top element.
getMin() -- Retrieve the minimum element in the stack.

Example:
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();   --> Returns -3.
minStack.pop();
minStack.top();      --> Returns 0.
minStack.getMin();   --> Returns -2.
```
#### Solution
```java
/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack obj = new MinStack();
 * obj.push(x);
 * obj.pop();
 * int param_3 = obj.top();
 * int param_4 = obj.getMin();
 */
class MinStack {
    private Stack<Integer> stack;
    private Integer min;
        
    /** initialize your data structure here. */
    public MinStack() {
        stack = new Stack<>();
    }
    
    public void push(int x) {
        if (min == null || x <= min) {
            stack.push(min);
            min = x;
        }
        stack.push(x);
    }
    
    public void pop() {
        // the JVM is caching Integer values
        // == only works for numbers between -128 and 127
        if (stack.pop().equals(min)) {
            min = stack.pop();
        }
    }

    public int top() {
        return stack.peek();
    }
    
    public int getMin() {
        return min;
    }
}
```
Yet another solution
```java
class MinStack {
    private class Node {
        int val;
        int min;
        Node next;

        private Node(int val, int min, Node next) {
            this.val = val;
            this.min = min;
            this.next = next;
        }
    }
    
    private Node head;
    
    /** initialize your data structure here. */
    public MinStack() {
        
    }
    
    public void push(int x) {
        if (head == null) {
            head = new Node(x, x, null);
        } else {
            head = new Node(x, Math.min(x, head.min), head);
        }  
    }
    
    public void pop() {
        head = head.next;
    }
    
    public int top() {
        return head.val;
    }
    
    public int getMin() {
        return head.min;
    }
}
```


## Math

### Count Primes - 204
Easy
{:.badge.e}
#### Problem
```text
Count the number of prime numbers less than a non-negative number, n.

Example:
Input: 10
Output: 4
Explanation: There are 4 prime numbers less than 10, they are 2, 3, 5, 7.
```
#### Solution
Prime is a number only divisable by 1 and itself (2 is the smallest prime).  
So if the number is a multiple of a number smaller than itself, then it's not a prime number.  

Follow this idea, we can calculate non-primes on the fly during iterations.  
For example, when iterate to 2, mark all multiples of 2 as non-prime, then mark multiples of 3 as non-prime ..  

This is called *Sieve of Eratosthenes*  
![Sieve of Eratosthenes](https://assets.leetcode.com/static_assets/public/images/solutions/Sieve_of_Eratosthenes_animation.gif){:.img-fluid}
```java
class Solution {
    /* nlog(log(n)) */
    public int countPrimes(int n) {
        int count = 0;
        boolean[] notPrime = new boolean[n];
        for (int i = 2; i < n; i++) {  // O(n)
            if (!notPrime[i]) {
                count++;
                // all multiples of i are not prime 
                for (int j = 2; i * j < n; j++) {  // O(log(log(n))) => O(n/2 + n/3 + n/5 + ..)
                    notPrime[i * j] = true;
                }

                // Or we can mark multiples of i starting at i
                // because i × (num < i) was already marked off by multiple of (num < i)
                // for (int j = i; j <= (n - 1) / i; j++) {
                //     notPrime[i * j] = true;
                // }
            }
        }
        return count;
    }
}
```
We can cut the space in half by storing only odd numbers
```java
class Solution {
    public int countPrimes(int n) {
        if (n <= 2) return 0;  // we want prime less than n
        
        int count = 1;  // 2
        boolean[] notPrime = new boolean[n / 2];  // store odd numbers starting from 3
        
        for (int i = 3; i < n; i += 2) {
            if (!notPrime[i / 2 - 1]) {
                count++;                
                for (int j = 3; i * j < n; j += 2) {
                    notPrime[i * j / 2 - 1] = true;
                }
            }
        }
        
        return count;
    }
}
```


## Bit Manipulation

### Single Number - 136
Easy
{:.badge.e}
#### Problem
```text
Given a non-empty array of integers, every element appears twice except for
one. Find that single one.

Note:
Your algorithm should have a linear runtime complexity. Could you implement
it without using extra memory?

Example 1:
Input: [2,2,1]
Output: 1

Example 2:
Input: [4,1,2,1,2]
Output: 4
```
#### Solution
Use bitwise XOR to solve this problem

`0 ^ N = N`  
`N ^ N = 0`

So..... if N is the single number

N1 ^ N1 ^ N2 ^ N2 ^..............^ Nx ^ Nx ^ N  
= (N1^N1) ^ (N2^N2) ^..............^ (Nx^Nx) ^ N  
= 0 ^ 0 ^ ..........^ 0 ^ N  
= N  
```java
class Solution {
    public int singleNumber(int[] nums) {
        int res = 0;
        for (int i : nums) {
            res ^= i;
        }
        return res;
    }
}
```

### Bitwise AND of Numbers Range - 201
Medium
{:.badge.m}
#### Problem
```
Given a range [m, n] where 0 <= m <= n <= 2147483647, 
return the bitwise AND of all numbers in this range, inclusive.

Example 1:
Input: [5,7]
Output: 4

Example 2:
Input: [0,1]
Output: 0
```
#### Solution
First let's think what does bitwise AND do to two numbers, for example ( 0b means base 2)
```
4 & 7 = 0b100 & 0b111 = 0b100
5 & 7 = 0b101 & 0b111 = 0b101
5 & 6 = 0b101 & 0b110 = 0b100
```
The operator & is keeping those bits which is set in both number.

For several numbers, the operator & is keeping those bits which is 1 in every number.

In one word, this problem is asking us to find the common prefix of m and n 's binary code.
```java
class Solution {
    public int rangeBitwiseAnd(int m, int n) {
        int i = 0;
        while (m != n) {
            m >>= 1;
            n >>= 1;
            i++;
        }
        return m << i;
    }
}
```

### Prime Number of Set Bits in Binary Representation - 762
Easy
{:.badge.e}
#### Problem
```
Given two integers L and R, find the count of numbers in the range [L, R]
(inclusive) having a prime number of set bits in their binary
representation.

(Recall that the number of set bits an integer has is the number of 1s
present when written in binary.  For example, 21 written in binary is 10101
which has 3 set bits.  Also, 1 is not a prime.)

Example 1:
Input: L = 6, R = 10
Output: 4
Explanation:
6 -> 110 (2 set bits, 2 is prime)
7 -> 111 (3 set bits, 3 is prime)
9 -> 1001 (2 set bits , 2 is prime)
10->1010 (2 set bits , 2 is prime)

Example 2:
Input: L = 10, R = 15
Output: 5
Explanation:
10 -> 1010 (2 set bits, 2 is prime)
11 -> 1011 (3 set bits, 3 is prime)
12 -> 1100 (2 set bits, 2 is prime)
13 -> 1101 (3 set bits, 3 is prime)
14 -> 1110 (3 set bits, 3 is prime)
15 -> 1111 (4 set bits, 4 is not prime)

Note:
L, R will be integers L  in the range [1, 10^6].
R - L will be at most 10000.
```
#### Solution
```java
class Solution {
    public int countPrimeSetBits(int L, int R) {
        int res = 0;
        for (int i = L; i <= R; i++) {
            if (isPrime(getSetBits(i))) res++;
        }
        return res;
    }
    
    public int getSetBits(int num) {
        int res = 0;
        while (num > 0) {
            if ((num & 1) == 1) res++;
            num >>= 1;
        }
        return res;
    }
    
    public boolean isPrime(int num) {
        if (num < 2) return false;
        for (int i = 2; i < num; i++) {
            if (num % i == 0) return false;
        }
        return true;
    }
}
```

<script>
    $(() => {
        $('h1').first()
            .after(`<div style="display: inline-block; vertical-align: top; margin-top: 1.5rem">
                    <div class="badge e">Easy&nbsp${$('.e').length}</div>
                    <div class="badge m">Medium&nbsp${$('.m').length}</div>
                    <div class="badge h">Hard&nbsp${$('.h').length}</div>
                    </div>`);
    });
</script>