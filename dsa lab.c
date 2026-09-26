#include <stdio.h>
#include <stdlib.h>
 
struct Node {
    int data;
    struct Node *next;
};
 
struct Node *head = NULL;
 
// Insert using for loop
void insertNodes() {
    int n, value;
    struct Node *newNode, *temp;
 
    printf("How many nodes to insert? ");
    scanf("%d", &n);
 
    for (int i = 1; i <= n; i++) {
        newNode = (struct Node*)malloc(sizeof(struct Node));
 
        printf("Enter value for node %d: ", i);
        scanf("%d", &value);
 
        newNode->data = value;
        newNode->next = NULL;
 
        if (head == NULL) {
            head = newNode;
        } else {
            temp = head;
            while (temp->next != NULL) {
                temp = temp->next;
            }
            temp->next = newNode;
        }
    }
}
 
// Delete first occurrence of a value
void deleteNode() {
    int value;
    struct Node *temp = head, *prev = NULL;
 
    if (head == NULL) {
        printf("List is empty.\\n");
        return;
    }
 
    printf("Enter value to delete: ");
    scanf("%d", &value);
 
    if (head->data == value) {
        temp = head;
        head = head->next;
        free(temp);
        printf("Node deleted.\\n");
        return;
    }
 
    while (temp != NULL && temp->data != value) {
        prev = temp;
        temp = temp->next;
    }
 
    if (temp == NULL) {
        printf("Value not found.\\n");
        return;
    }
 
    prev->next = temp->next;
    free(temp);
    printf("Node deleted.\\n");
}
 
// Display list
void display() {
    struct Node *temp = head;
 
    if (head == NULL) {
        printf("List is empty.\\n");
        return;
    }
 
    printf("Linked List: ");
    while (temp != NULL) {
        printf("%d -> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\\n");
}
 
int main() {
    int choice;
 
    do {
        printf("\\n--- Single Linked List Menu ---\\n");
        printf("1. Insert Nodes\\n");
        printf("2. Delete Node\\n");
        printf("3. Display\\n");
        printf("4. Exit\\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);
 
        switch (choice) {
            case 1:
                insertNodes();
                break;
 
            case 2:
                deleteNode();
                break;
 
            case 3:
                display();
                break;
 
            case 4:
                printf("Exiting...\\n");
                break;
 
            default:
                printf("Invalid choice!\\n");
        }
 
    } while (choice != 4);
 
    return 0;
}