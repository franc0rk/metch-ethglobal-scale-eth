export default function AttestationModal({
  onClose,
  receiver = { name: "s" },
}) {
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="p-4 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div>
              <div className="sm:flex sm:items-start">
                <div className="sm:mt-0">
                  <h3 className="text-purple-500 leading-6" id="modal-title">
                    Send Proof of Hacking
                  </h3>
                  <div className="mt-2 flex items-start">
                    <div className="text-sm text-gray-500">
                      <img
                        className="w-12 h-12 rounded-full"
                        src={receiver.imageUrl}
                      />
                    </div>
                    <div className="p-2">
                      <div className="mb-2">
                        <select className="border border-gray-300 rounded-lg p-1 w-full">
                          <option value="metch.attestations.rocks">
                            🤘 {receiver.name} rocks!
                          </option>
                          <option value="metch.attestations.learns_fast">
                            🤓 {receiver.name} learns fast!
                          </option>
                          <option value="metch.attestations.inspires">
                            🚀 {receiver.name} inspires!
                          </option>
                        </select>
                      </div>
                      <div>
                        <textarea
                          className="w-full border border-gray-300 rounded-lg p-2"
                          placeholder="Why?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="w-full rounded-lg border-2 border-purple-500 font-semibold p-2 text-purple-500 mb-2"
                onClick={() => onClose()}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full rounded-lg bg-purple-500 p-2 font-semibold text-white"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
