import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      _id
      name
      email
      role
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      _id
      name
      email
      role
      status
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id) {
      _id
      name
      email
      role
      status
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($id: String!, $input: ResetPasswordInput!) {
    resetPassword(id: $id, input: $input) {
      _id
      name
      email
      status
    }
  }
`;

export const UPDATE_STATUS = gql`
  mutation UpdateStatus($id: String!, $input: UpdateStatusInput!) {
    updateStatus(id: $id, input: $input) {
      _id
      name
      email
      status
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($category: CategoryInput!) {
    createCategory(category: $category) {
      _id
      name
      image
      description
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: String!, $category: CategoryInput!) {
    updateCategory(id: $id, category: $category) {
      _id
      name
      image
      description
    }
  }
`;

export const UPDATE_SUBCATEGORY = gql`
  mutation UpdateSubcategory($id: String!, $subcategory: SubCategoryInput!) {
    updateSubcategory(id: $id, subcategory: $subcategory) {
      _id
      name
      price
      pawanmedia
      nagarpalika_tax
      park
      category {
        _id
        name
      }
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) {
      _id
    }
  }
`;

export const CREATE_SUBCATEGORY = gql`
  mutation CreateSubcategory($subcategory: SubCategoryInput!) {
    createSubcategory(subcategory: $subcategory) {
      _id
      name
      price
      pawanmedia
      nagarpalika_tax
      park
      category {
        _id
      }
    }
  }
`;

export const DELETE_SUBCATEGORY = gql`
  mutation DeleteSubCategory($id: String!) {
    deleteSubcategory(id: $id) {
      _id
    }
  }
`;

export const CREATE_BOOKING = gql`
  mutation CreateBooking($createBookingInput: CreateBookingInput!) {
    createBooking(createBookingInput: $createBookingInput) {
      _id
      name
    }
  }
`;

export const UPDATE_BOOKING = gql`
  mutation UpdateBooking($updateBookingInput: UpdateBookingInput!) {
    updateBooking(updateBookingInput: $updateBookingInput) {
      _id
      name
      phone
      visitors
      category {
        _id
        name
      }
      subcategory {
        _id
        name
      }
      paymentMethod
      remarks
      price
      pawanMediaRevenue
      nagarpalikaTax
      parkRevenue
    }
  }
`;
