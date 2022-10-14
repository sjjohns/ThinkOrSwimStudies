#
# Copyright 2022 Scott J. Johnson (https://scottjjohnson.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

#
# AnchoredVWAP
#
# Calculates anchored volume-weighted average price. If used on a chart
# with an aggregation period of Day or higher, the anchor time is ignored
# and the full volume on the first bar is counted.
#

input anchorDate = 20220101;
input anchorTime = 0000;

def todaysDate = GetYYYYMMDD();
def todayIsAnchorDate = if todaysDate == anchorDate then 1 else 0;
def afterAnchorDate = if todaysDate > anchorDate then 1 else 0;
def afterAnchorTime = if SecondsFromTime(anchorTime) >= 0 then 1 else 0;
def afterAnchorDateTime = (todayIsAnchorDate and afterAnchorTime) or afterAnchorDate;

def priceSum = TotalSum(if afterAnchorDateTime then (high + low + close) / 3 * volume else 0);
def volumeSum = TotalSum(if afterAnchorDateTime then volume else 0);

plot anchoredVWAP = priceSum / volumeSum;
anchoredVWAP.SetPaintingStrategy(PaintingStrategy.LINE);
anchoredVWAP.SetDefaultColor(Color.CYAN);
