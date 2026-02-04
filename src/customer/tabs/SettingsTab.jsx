import React from 'react';

function SettingsTab({ user }) {
    return (
        <div className="card border-0 shadow-sm p-4" style={{ maxWidth: '600px' }}>
            <h4 className="mb-4">Account Settings</h4>
            <form onClick={e => e.preventDefault()}>
                <div className="mb-3">
                    <label className="form-label">Update Name</label>
                    <input type="text" className="form-control" defaultValue={user.name} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Change Password</label>
                    <input type="password" className="form-control" placeholder="New Password" />
                </div>
                <button className="btn btn-dark">Save Changes</button>
            </form>
        </div>
    );
}

export default SettingsTab;
