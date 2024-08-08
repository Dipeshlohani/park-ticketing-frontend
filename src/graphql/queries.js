import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      _id
      name
      email
      role
      status
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    categories {
      _id
      name
      image
      description
    }
  }
`;

export const GET_ALL_SUBCATEGORIES = gql`
  query GetAllSubcategories {
    subcategories {
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

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      _id
      name
    }
  }
`;
export const GET_SUBCATEGORIES = gql`
  query GetSubcategories($categoryId: String!) {
    subCategories(categoryId: $categoryId) {
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

export const GET_BOOKINGS = gql`
  query GetBookings($limit: Int, $offset: Int) {
    bookings(limit: $limit, offset: $offset) {
      bookings {
        _id
        name
        ticket_no
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
        price
        pawanMediaRevenue
        nagarpalikaTax
        parkRevenue
        paymentMethod
        remarks
        createdAt
        createdBy
      }
      totalBookings
    }
  }
`;

export const SEARCH_BOOKINGS = gql`
  query SearchBookings($searchTerm: String!) {
    searchBookings(searchTerm: $searchTerm) {
      _id
      ticket_no
      name
      visitors
      category {
        _id
        name
      }
      subcategory {
        _id
        name
      }
      price
      pawanMediaRevenue
      nagarpalikaTax
      parkRevenue
      phone
      paymentMethod
      createdAt
      createdBy
      remarks
    }
  }
`;

export const DASHBOARD_QUERY = gql`
  query GetDashboardData {
    dashboard {
      overallRevenue {
        total
        yearly
        monthly
        weekly
        daily
      }
      pawanMediaRevenue {
        total
        yearly
        monthly
        weekly
        daily
      }
      nagarpalikaTax {
        total
        yearly
        monthly
        weekly
        daily
      }
      parkRevenue {
        total
        yearly
        monthly
        weekly
        daily
      }
      bookedTickets {
        total
        yearly
        monthly
        weekly
        daily
      }
      visitors {
        total
        yearly
        monthly
        weekly
        daily
      }
      # totalUsers
      # admins
      # staffs
    }
  }
`;

export const GET_USER_COUNTS = gql`
  query GetUserCounts {
    getUserCounts {
      totalUsers
      staffCount
      directorCount
      adminCount
    }
  }
`;

export const GET_CATEGORY_SHARE = gql`
  query GetCategoryShare {
    getCategoryShare {
      category
      count
    }
  }
`;

export const GET_SUBCATEGORY_SHARE = gql`
  query GetSubCategoryShare {
    getSubCategoryShare {
      subcategory
      count
    }
  }
`;

export const GET_YEARLY_REPORT = gql`
  query GetYearlyReport($year: Float!) {
    getYearlyReport(year: $year) {
      year
      monthlyReports {
        month
        pawanMedia
        thankotTribhuwanPark
        chandragiriMunicipality
        total
        paidToTTP
        totalSales
      }
    }
  }
`;

export const GET_MONTHLY_BOOKINGS = gql`
  query GetMonthlyBookings($year: Float!, $month: String!) {
    getMonthlyBookings(year: $year, month: $month) {
      bookings {
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
        price
        pawanMediaRevenue
        nagarpalikaTax
        parkRevenue
        paymentMethod
        remarks
        createdAt
        createdBy
        ticket_no
      }
      totals {
        pawanMediaRevenue
        nagarpalikaTax
        parkRevenue
        price
      }
    }
  }
`;
