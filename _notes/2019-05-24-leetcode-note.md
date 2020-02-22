---
author: Chauncy
category: code
---

## String

### Longest Substring Without Repeating Characters - 3  
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


### Palindrome Number - 9
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
#### Problem
```text
Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
    1. Open brackets must be closed by the same type of brackets.
    2. Open brackets must be closed in the correct order.
Note that an empty string is also considered valid.

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


## Array

### Three Sum - 15
#### Problem
```text
Given an array nums of n integers, are there elements a, b, c in nums such that a + b + c = 0? Find all unique triplets in the array which gives the sum of zero.

Note:
The solution set must not contain duplicate triplets.

Example:
Given array nums = [-1, 0, 1, 2, -1, -4],

A solution set is:
[
  [-1, 0, 1],
  [-1, -1, 2]
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


### Kth Largest Element in an Array - 215
#### Problem
```text
Find the kth largest element in an unsorted array. Note that it is the kth largest element in the sorted order, not the kth distinct element.

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
Naive approach, simply sort the array. Time complexity: `O(nlogn)`
```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        Arrays.sort(nums);
        return nums[nums.length - k];
    }
}
```
Priority queue approach, use a max-heap to keep the first k largest element. Time complexity: `O(nlogk)`
**Note**: min-heap comparator: `(n1, n2) -> n2 - n1` or `Collections.reverseOrder()` 
```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>((n1, n2) -> n1 - n2);
        for (int i : nums) {
            heap.add(i);
            if (heap.size() > k) {
                heap.poll();
            }
        }
        return heap.poll();
    }
}
```
And...Python Hack!
```python
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        return heapq.nlargest(k, nums)[-1]
```
`TODO: Quickselect`

### K Closest Points to Origin - 973
#### Problem
```text
We have a list of points on the plane.  Find the K closest points to the origin (0, 0).

(Here, the distance between two points on a plane is the Euclidean distance.)

You may return the answer in any order.  The answer is guaranteed to be unique (except for the order that it is in.)

Example 1:
Input: points = [[1,3],[-2,2]], K = 1
Output: [[-2,2]]
Explanation: 
The distance between (1, 3) and the origin is sqrt(10).
The distance between (-2, 2) and the origin is sqrt(8).
Since sqrt(8) < sqrt(10), (-2, 2) is closer to the origin.
We only want the closest K = 1 points from the origin, so the answer is just [[-2,2]].

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

`TODO: Divide and Conquer`

## Tree

### Binary Tree Inorder Traversal - 94
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
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def inorderTraversal(self, root: TreeNode) -> List[int]:
        def trav(node, res):
            if node:
                trav(node.left, res)
                res.append(node.val)
                trav(node.right, res)
        res = []
        trav(root, res)
        return res
```
Since recursive solution is trivial :), let's do it iteratively!
```python
class Solution:
    def inorderTraversal(self, root: TreeNode) -> List[int]:
        stack, res = [], []
        cur = root
        while cur or stack:
            while cur:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            res.append(cur.val)
            cur = cur.right
        return res
```


### Binary Tree Preorder Traversal - 144
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
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def preorderTraversal(self, root: TreeNode) -> List[int]:
        def trav(node, res):
            if node:
                res.append(node.val)
                trav(node.left, res)
                trav(node.right, res)
        res = []
        trav(root, res)
        return res
```
Then the iterative approach.
```python
class Solution:
    def preorderTraversal(self, root: TreeNode) -> List[int]:
        stack, res = [root], []
        while stack:
            cur = stack.pop()
            if cur:
                res.append(cur.val)
                if cur.right:
                    stack.append(cur.right)
                if cur.left:
                    stack.append(cur.left)
        return res
```


### Binary Tree Postorder Traversal - 145
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
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def postorderTraversal(self, root: TreeNode) -> List[int]:
        stack, res = [root], []
        while stack:
            cur = stack.pop()
            if cur:
                res.append(cur.val)            
                if cur.left:
                    stack.append(cur.left)
                if cur.right:
                    stack.append(cur.right)
        return res[::-1]  # wow, awesome :D
```


### Lowest Common Ancestor of a Binary Search Tree - 235
#### Problem
```text
Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes in the BST.

According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).”

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
Explanation: The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself according to the LCA definition.
```
#### Solution
Since it's a BST, the LCA is the split point of the two nodes, we could easily find it with this property. 
```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        if not root:
            return None
        cur = root
        while cur:
            if cur.val < p.val and cur.val < q.val:
                cur = cur.right
            elif cur.val > p.val and cur.val > q.val:
                cur = cur.left
            else:
                return cur
        return None
```


### Lowest Common Ancestor of a Binary Tree - 236
#### Problem
```text
Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).”

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
Explanation: The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself according to the LCA definition.
 
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

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        parent = {root: None}
        stack = [root]
        # use a stack to traversal the tree and store parent nodes of each nodes in the parent dict
        while stack and (p not in parent or q not in parent):
            cur = stack.pop()
            if cur.right:
                parent[cur.right] = cur
                stack.append(cur.right)
            if cur.left:
                parent[cur.left] = cur
                stack.append(cur.left)
        ancestor = set()
        # add all ancestors of p into the ancestor set
        while p:
            ancestor.add(p)
            p = parent[p]
        # iterate through ancestors of q
        while q:
            if q in ancestor:
                return q
            q = parent[q]
        return None
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
        helper(res, n, 0, new StringBuilder());
        return res;
    }
    
    private void helper(List<String> list, int r, int l, StringBuilder str) {
        if (r == 0 && l == 0) {
            list.add(str.toString());
            return;
        }
        if (r > 0) {
            helper(list, r - 1, l + 1, str.append("("));
            str.deleteCharAt(str.length() - 1);
        }
        if (l > 0) {
            helper(list, r, l - 1, str.append(")"));
            str.deleteCharAt(str.length() - 1);
        }
    }
}
```


## BFS / DFS

## Dynamic Programming

## Design
