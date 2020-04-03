---
layout: note
author: Chauncy
category: note
published: true
---

# Leetcode Note

## String

### Longest Substring Without Repeating Characters - 3  
Substring
{: .badge .badge-secondary}
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
Palindrome
{: .badge .badge-secondary}
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
Other
{: .badge .badge-secondary}
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
Other
{: .badge .badge-secondary}
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
Palindrome
{: .badge .badge-secondary}
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
Stack
{: .badge .badge-secondary}
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

### Basic Calculator - 224
Other
{: .badge .badge-secondary}
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


## Array

### Two Sum - 1
N Sum
{: .badge .badge-secondary}
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
N Sum
{: .badge .badge-secondary}
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


## Tree

### Binary Tree Inorder Traversal - 94
Traversal
{: .badge .badge-secondary}
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
Traversal
{: .badge .badge-secondary}
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
Traversal
{: .badge .badge-secondary}
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


### Lowest Common Ancestor of a Binary Search Tree - 235
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



## LinkedList

### Add Two Numbers - 2  
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


## Sort

### Merge Intervals - 56
Merge Intervals
{: .badge .badge-secondary}
#### Problem
```text
Given a collection of intervals, merge all overlapping intervals.

Example 1:
Input: [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlaps, merge them into
[1,6].

Example 2:
Input: [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.

NOTE: input types have been changed on April 15, 2019. Please reset to
default code definition to get new method signature.
```
#### Solution
```java
class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

        List<Integer[]> res = new ArrayList<>();
        int index = -1;
        for (int[] interval : intervals) {
            if (res.size() == 0 || res.get(index)[1] < interval[0]) {
                res.add(new Integer[]{interval[0], interval[1]});
                index++;
            } else {
                Integer[] tmp = res.get(index);
                tmp[0] = Math.min(tmp[0], interval[0]);
                tmp[1] = Math.max(tmp[1], interval[1]);
                res.set(index, tmp);
            }
        }
        
        int[][] ans = new int[res.size()][2];
        for (int i = 0; i < res.size(); i++) {
            ans[i][0] = res.get(i)[0];
            ans[i][1] = res.get(i)[1];
        }
        
        return ans;
    }
}
```

### Meeting Rooms - 252
Merge Intervals
{: .badge .badge-secondary}
#### Problem
```text
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
Merge Intervals
{: .badge .badge-secondary}
#### Problem
```text
Given an array of meeting time intervals consisting of start and end times [[s1,e1],[s2,e2],...] (si < ei), 
find the minimum number of conference rooms required.

Example 1:
Input: [[0, 30],[5, 10],[15, 20]]
Output: 2

Example 2:
Input: [[7,10],[2,4]]
Output: 1
```
#### Solution
```java
class Solution {
    public int minMeetingRooms(int[][] intervals) {
        if (intervals.length == 0) return 0;
        
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);        
        PriorityQueue<Integer[]> minQ = new PriorityQueue<>((a, b) -> a[1] - b[1]);
        
        for (int[] i : intervals) {
            // if current interval's start time > smallest end time in the minQ, we know that we can use that room
            // otherwise, we need a new room
            if (!minQ.isEmpty() && i[0] >= minQ.peek()[1]) minQ.poll();
            minQ.offer(new Integer[]{i[0], i[1]});
        }
        
        return minQ.size();
    }
}
```

### Kth Largest Element in an Array - 215
Priority Queue
{: .badge .badge-secondary}
Quick Select
{: .badge .badge-secondary}
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
Priority Queue
{: .badge .badge-secondary}
Quick Select
{: .badge .badge-secondary}
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
Memoization
{: .badge .badge-secondary}
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

### Word Ladder - 127
BFS
{: .badge .badge-secondary}
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
BFS
{: .badge .badge-secondary}
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
DFS
{: .badge .badge-secondary}
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
DFS
{: .badge .badge-secondary}
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
DFS
{: .badge .badge-secondary}
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
Topological Sort
{: .badge .badge-secondary}
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
Topological Sort
{: .badge .badge-secondary}
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

### Climbing Stairs - 70
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


## Design

### LRU Cache - 146
#### Problem
```text
Design and implement a data structure for Least Recently Used (LRU) cache.
It should support the following operations: get and put.

get(key) - Get the value (will always be positive) of the key if the key
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
        min = null;
    }
    
    public void push(int x) {
        if (min == null || x <= min) {
            stack.push(min);
            min = x;
        }
        stack.push(x);
    }
    
    public void pop() {
        int val = stack.pop();
        if (val == min) {
            min = stack.pop();
        }

        //why this way will get wrong result
        // if (stack.pop() == min) {
            // min = stack.pop();
        // }
    }
    
    public int top() {
        return stack.peek();
    }
    
    public int getMin() {
        return min;
    }
}
```


## Bit Manipulation
### Single Number - 136
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