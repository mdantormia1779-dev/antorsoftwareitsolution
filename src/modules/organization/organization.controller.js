// যদি সার্ভিস ফাইলটি একই ফোল্ডারে (organization ফোল্ডারে) থাকে:
import { 
  fetchAllOrganizations, 
  createOrganizationData, 
  fetchOrganizationById, 
  updateOrganizationData, 
  fetchOrgAnalytics,
  deleteOrganizationData 
} from './organization.service.js';

// ১. সমস্ত অর্গানাইজেশন ফেচ করার কন্ট্রোলার
export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await fetchAllOrganizations();
    
    return res.status(200).json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ২. নতুন অর্গানাইজেশন তৈরি করার কন্ট্রোলার
export const createOrganization = async (req, res) => {
  try {
    const organization = await createOrganizationData(req.body);

    return res.status(201).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ৩. অর্গানাইজেশন ডিটেইলস পাওয়ার কন্ট্রোলার
export const getOrganizationDetails = async (req, res) => {
  try {
    const organizationId = req.user?.organizationId || req.params.id;
    const organization = await fetchOrganizationById(organizationId);

    return res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ৪. অর্গানাইজেশন আপডেট করার কন্ট্রোলার
export const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrganization = await updateOrganizationData(id, req.body);

    return res.status(200).json({
      success: true,
      data: updatedOrganization,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ৫. ড্যাশবোর্ড অ্যানালিটিক্স কন্ট্রোলার
export const getDashboardAnalytics = async (req, res) => {
  try {
    const organizationId = req.user?.organizationId;
    const analytics = await fetchOrgAnalytics(organizationId);

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrganization = await deleteOrganizationData(id);

    return res.status(200).json({
      success: true,
      message: 'Organization deleted successfully',
      data: deletedOrganization,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};